import { describe, expect, it } from "vitest";

import { resolveWebReleaseMetadata } from "@lib/webReleaseMetadata";

describe("webReleaseMetadata", () => {
  it("returns trimmed public release metadata", () => {
    expect(
      resolveWebReleaseMetadata({
        NEXT_PUBLIC_RELEASE_IMAGE: " ghcr.io/x-evor/console:abc123 ",
        NEXT_PUBLIC_RELEASE_TAG: " abc123 ",
        NEXT_PUBLIC_RELEASE_COMMIT: " abc123 ",
        NEXT_PUBLIC_RELEASE_VERSION: " sha-abc123 ",
      }),
    ).toEqual({
      image: "ghcr.io/x-evor/console:abc123",
      tag: "abc123",
      commit: "abc123",
      version: "sha-abc123",
    });
  });

  it("normalizes empty public release metadata to null", () => {
    expect(
      resolveWebReleaseMetadata({
        NEXT_PUBLIC_RELEASE_IMAGE: " ",
        NEXT_PUBLIC_RELEASE_TAG: "",
        NEXT_PUBLIC_RELEASE_COMMIT: undefined,
        NEXT_PUBLIC_RELEASE_VERSION: "   ",
      }),
    ).toEqual({
      image: null,
      tag: null,
      commit: null,
      version: null,
    });
  });
});
