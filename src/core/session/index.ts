import { atom } from "../utils/atoms";
import { Session } from "./types";
import { getEmptySession, serializeSession } from "./utils";

/**
 * Producers:
 * **********
 */

/**
 * Public API:
 * ***********
 */
export const sessionAtom = atom<Session>(getEmptySession());

/**
 * Bindings:
 * *********
 */
sessionAtom.bind((session) => {
  sessionStorage.setItem("session", serializeSession(session));
});
