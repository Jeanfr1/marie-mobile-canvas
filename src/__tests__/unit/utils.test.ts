import { cn } from "../../lib/utils";

describe("Utils", () => {
  describe("cn function", () => {
    test("combines class names correctly", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });

    test("handles conditional classes", () => {
      const condition = true;
      expect(cn("base", condition && "conditional")).toBe("base conditional");
      expect(cn("base", !condition && "conditional")).toBe("base");
    });

    test("handles undefined and null values", () => {
      expect(cn("base", undefined, null)).toBe("base");
    });

    test("handles empty strings", () => {
      expect(cn("base", "")).toBe("base");
    });

    test("handles arrays of classes", () => {
      expect(cn(["class1", "class2"])).toBe("class1 class2");
    });

    test("handles objects with boolean values", () => {
      expect(cn({ class1: true, class2: false })).toBe("class1");
    });

    test("handles mixed input types", () => {
      expect(
        cn("base", ["array1", "array2"], { obj1: true, obj2: false })
      ).toBe("base array1 array2 obj1");
    });

    test("handles complex nested conditions", () => {
      const isActive = true;
      const isDisabled = false;
      expect(
        cn(
          "base",
          isActive && "active",
          isDisabled && "disabled",
          !isActive && "inactive"
        )
      ).toBe("base active");
    });
  });
});
