import * as CryptoJS from 'crypto-js';
import { random } from 'lodash';

import { HeartBaseDateType, DeviceType, HmacsData, LiveHeartRuleId } from '../interface/LiveHeart';
import { getLIVE_BUVID, createUUID, getBiliJct, apiDelay } from '../utils';
import { TaskConfig } from '../config/globalVar';
import * as liveHeartRequest from '../net/liveHeartRequest';
import { LiveHeartEDto } from '../dto/Live.dto';

/**
 * 处理数据
 */
function hmacs(hmacsData: HmacsData, rule: LiveHeartRuleId) {
  const [parent_id, area_id, seq_id, room_id] = JSON.parse(hmacsData.id) as LiveHeartRuleId;
  const [buvid, uuid] = JSON.parse(hmacsData.device) as DeviceType;
  const { ets, time, ts } = hmacsData;

  const newData = {
    platform: 'web',
    parent_id,
    area_id,
    seq_id,
    room_id,
    buvid,
    uuid,
    ets,
    time,
    ts,
  };

  const key = hmacsData.benchmark;
  const HmacFuncString = ['MD5', 'SHA1', 'SHA256', 'SHA224', 'SHA512', 'SHA384'];
  let s = JSON.stringify(newData);

  for (const r of rule) {
    s = CryptoJS[`Hmac${HmacFuncString[r]}`](s, key).toString(CryptoJS.enc.Hex);
  }
  return s;
}

function createBaseData(): HeartBaseDateType {
  const csrf_token = getBiliJct(),
    csrf = csrf_token;
  const device: DeviceType = [getLIVE_BUVID(), createUUID()];
  return {
    ua: TaskConfig.USER_AGENT,
    id: [1, 21, 0, 50821],
    csrf_token,
    csrf,
    device,
  };
}

/**
 * 发送 E 请求
 */
async function postE(baseDate: HeartBaseDateType) {
  const postData = {
    id: JSON.stringify(baseDate.id),
    device: JSON.stringify(baseDate.device),
    ts: new Date().getTime(),
    is_patch: 0,
    heart_beat: '[]',
    ua: baseDate.ua,
    visit_id: '',
    csrf: baseDate.csrf,
    csrf_token: baseDate.csrf_token,
  };

  const { data, code } = await liveHeartRequest.postE(postData);
  if (code === 0) {
    console.log('发送一次 E 请求');
    return data;
  }
}

/**
 * 发送 X 请求
 */
async function postX(rDate: LiveHeartEDto['data'], baseDate: HeartBaseDateType) {
  const postData = {
    id: JSON.stringify(baseDate.id),
    device: JSON.stringify(baseDate.device),
    ets: rDate.timestamp,
    benchmark: rDate.secret_key,
    time: 60,
    ts: new Date().getTime(),
    ua: baseDate.ua,
  };

  const s = hmacs(postData, rDate.secret_rule);

  const { data, code } = await liveHeartRequest.postX(
    Object.assign(
      {
        visit_id: '',
        csrf: baseDate.csrf,
        csrf_token: baseDate.csrf_token,
        s,
      },
      postData,
    ),
  );

  if (code === 0) {
    console.log('发送一次 X 请求');
    return data;
  }
}

async function heartBeat() {
  try {
    await liveHeartRequest.heartBeat();
    console.log('发送一次 heartBeat');
  } catch {}
}

export default async function liveHeart() {
  console.log('----【直播心跳】----');

  const baseData = createBaseData();

  await heartBeat();
  await apiDelay(500);

  let rData = await postE(baseData);

  setInterval(async () => {
    rData = await postX(rData, baseData);
  }, 60 * 1000);

  setInterval(async () => {
    await heartBeat();
  }, random(60, 200) * 1000);
}
