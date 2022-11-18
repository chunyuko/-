import api, { signApi, initRequest } from "@/libs/api";
import env from "@/config/env";
import hook from "@/config/request/hook";
import options from "@/config/request/options";
import * as rights from "@/config/urls/rights";
import * as img from "@/config/urls/img";
import * as imgs from "@/config/urls/imgs";
import * as video from "@/config/urls/video";
import * as videos from "@/config/urls/videos";
import * as toapi from "@/config/urls/toapi";
import * as video1 from "@/config/urls/video1";
import * as videomenu from "@/config/urls/videomenu";
import * as imgmenu from "@/config/urls/imgmenu";
import * as img1 from "@/config/urls/img1";

initRequest({
  baseURL: env.baseURL,
  timeout: env.timeout,
});

initRequest(hook, "hook");
initRequest(options, "options");

signApi(rights);
signApi(img);
signApi(imgs);
signApi(video);
signApi(videos);
signApi(toapi);
signApi(video1);
signApi(videomenu);
signApi(imgmenu);
signApi(img1);

export default api;
export { signApi };
