import Vue from "vue";
import { event } from "./structs/logEvents";

declare module "vue/types/vue" {
  interface Vue {
    emitLogEvent(event: event): void;
  }
}
