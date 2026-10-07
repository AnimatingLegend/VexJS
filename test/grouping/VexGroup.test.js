import { describe, it, expect } from "vitest";
import { VexGroup, VexBasic } from "../../index.js";

/**
 * @file VexGroup.test.js
 * @description Mini `vitest` for VexGroup functionality
 */
describe("VexGroup", () => {
  it("Should return `null` when max capacity is reached.", () => {
    // Initalize the pool capacity. return a null object when max cap is reached.
    const group = new VexGroup(2);
    // Store a member when filling in a group.
    const firstMember = group.recycle(() => new VexBasic()); // slot 1
    group.recycle(() => new VexBasic()); // slot 2

    // If the pool is full, return a null object.
    const extraSlot = group.recycle(() => new VexBasic());
    expect(extraSlot).toBeNull();

    // Kill the member that already exists in the pool.
    firstMember.kill();

    // Recycle a killed object, and use it for future use.
    const reusedSlot = group.recycle(() => new VexBasic());
    expect(reusedSlot).toBe(firstMember);

    // Count the number of killed items.
    console.log("DEAD ITEM(S): " + group.countDead());
    // Reference the first dead item. (returns `null` if none exist)
    console.log("FIRST DEAD ITEM: " + group.getFirstDead());
    // Reference to a living item. (return `true` if active)
    console.log("ALIVE ITEM(S): " + group.getFirstAlive());
  });
});
