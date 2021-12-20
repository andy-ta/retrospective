import React from "react";
import { Text } from "@fluentui/react";

export function NoteFooter() {
  return (
    <div style={{ flex: 1 }}>
      <Text
        block={true}
        nowrap={true}
        variant={"medium"}
        styles={{
          root: { alignSelf: "center", marginLeft: 7 },
        }}
      >
      </Text>
    </div>
  );
}
