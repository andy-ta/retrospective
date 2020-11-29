import { IRuntimeFactory, } from '@fluidframework/container-definitions';
import { Container } from '@fluidframework/container-loader';
import { IRequest } from '@fluidframework/core-interfaces';
import { IFluidResolvedUrl, IResolvedUrl, IUrlResolver, } from '@fluidframework/driver-definitions';
import { getContainer } from '@fluidframework/get-tinylicious-container';
import { ITokenClaims, ScopeType } from '@fluidframework/protocol-definitions';
import { ITokenProvider, ITokenResponse, RouterliciousDocumentServiceFactory } from '@fluidframework/routerlicious-driver';
import { KJUR as jsrsasign } from 'jsrsasign';
import { v4 as uuid } from 'uuid';

const production = process.env.REACT_APP_PRODUCTION ?? false;
const fluidService = process.env.REACT_APP_TINYLICIOUS_URL ?? 'localhost:3000';

class InsecureTinyliciousUrlResolver implements IUrlResolver {

  public async resolve(request: IRequest): Promise<IResolvedUrl> {
    const http = production ? 'https' : 'http';
    const documentId = request.url.split('/')[0];
    const encodedDocId = encodeURIComponent(documentId);

    const documentUrl = `fluid://${fluidService}/tinylicious/${encodedDocId}`;
    const deltaStorageUrl = `${http}://${fluidService}/deltas/tinylicious/${encodedDocId}`;
    const storageUrl = `${http}://${fluidService}/repos/tinylicious`;

    const response: IFluidResolvedUrl = {
      endpoints: {
        deltaStorageUrl,
        ordererUrl: `${http}://${fluidService}`,
        storageUrl,
      },
      tokens: {jwt: this.auth(documentId)},
      type: 'fluid',
      url: documentUrl,
    };
    return response;
  }

  public async getAbsoluteUrl(resolvedUrl: IFluidResolvedUrl, relativeUrl: string): Promise<string> {
    const documentId = decodeURIComponent(resolvedUrl.url.replace(
      `fluid://${fluidService}/tinylicious/`,
      ''
    ));

    return `${documentId}/${relativeUrl}`;
  }

  private auth(documentId: string) {
    const claims: ITokenClaims = {
      documentId,
      scopes: ['doc:read', 'doc:write', 'summary:write'],
      tenantId: 'tinylicious',
      user: {id: uuid()},
      iat: Math.round(new Date().getTime() / 1000),
      exp: Math.round(new Date().getTime() / 1000) + 60 * 60, // 1 hour expiration
      ver: '1.0',
    };

    const utf8Key = {utf8: '12345'};

    return jsrsasign.jws.JWS.sign(null, JSON.stringify({alg: 'HS256', typ: 'JWT'}), claims, utf8Key);
  }
}

class InsecureTinyliciousTokenProvider implements ITokenProvider {

  constructor(private readonly documentId: string) {
  }

  public async fetchOrdererToken(): Promise<ITokenResponse> {
    return {
      fromCache: true,
      jwt: this.getSignedToken(),
    };
  }

  public async fetchStorageToken(): Promise<ITokenResponse> {
    return {
      fromCache: true,
      jwt: this.getSignedToken(),
    };
  }

  private getSignedToken(lifetime: number = 60 * 60, ver: string = '1.0'): string {
    // Current time in seconds
    const now = Math.round((new Date()).getTime() / 1000);

    const claims: ITokenClaims = {
      documentId: this.documentId,
      scopes: [ScopeType.DocRead, ScopeType.DocWrite, ScopeType.SummaryWrite],
      tenantId: 'tinylicious',
      user: {id: uuid()},
      iat: now,
      exp: now + lifetime,
      ver,
    };

    const utf8Key = {utf8: '12345'};
    // eslint-disable-next-line no-null/no-null
    return jsrsasign.jws.JWS.sign(null, JSON.stringify({alg: 'HS256', typ: 'JWT'}), claims, utf8Key);
  }
}

/**
 * Connect to the Tinylicious service and retrieve a Container with the given ID running the given code.
 * @param documentId - The document id to retrieve or create
 * @param containerRuntimeFactory - The container factory to be loaded in the container
 * @param createNew - To create a new container or not
 */
export async function getTinyliciousContainer(
  documentId: string,
  containerRuntimeFactory: IRuntimeFactory,
  createNew: boolean,
): Promise<Container> {
  const tokenProvider = new InsecureTinyliciousTokenProvider(documentId);
  const documentServiceFactory = new RouterliciousDocumentServiceFactory(tokenProvider);

  const urlResolver = new InsecureTinyliciousUrlResolver();

  return getContainer(
    documentId,
    createNew,
    {url: documentId},
    urlResolver,
    documentServiceFactory,
    containerRuntimeFactory,
  );
}
