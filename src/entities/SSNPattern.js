import { createEntity } from "@/lib/entityClient";

export const SSNPattern = createEntity("ssn_patterns", { scopedToUser: false });
