import { LiveHeartRuleId } from '../interface/LiveHeart';
import { ApiBaseProp, PureDataProp } from './BiLiBaseProp';

/** 直播签到 */
export interface LiveSignDto extends ApiBaseProp {
  data?: { text: string; hadSignDays: number; specialText: string } | null;
}

/** 直播签到信息 */
export interface LiveSignInfoDto extends ApiBaseProp {
  data?: {
    text: string;
    hadSignDays: number;
    specialText: string;
    status: 0 | 1;
  };
}

/** 获取瓜子状态 */
export interface SilverStatusDto extends ApiBaseProp {
  data: {
    silver: number; //银瓜子
    gold: number; //金瓜子
    coin: number; //硬币
    coin_2_silver_left: number; //
    silver_2_coin_left: 1 | 0; // (银瓜子到硬币)
    status: number;
    vip: number;
  };
}

/** 瓜子换硬币 */
export interface Silver2CoinDto extends PureDataProp {
  /**
   * 0 成功
   * 403 今日兑换过
   */
  code: number;
  data: {
    coin: number;
    gold: number;
    silver: number;
    /** eg: Silver2Coin00000000000000000000000 */
    tid: string;
  };
}

/** 我的钱包 */
export interface MyWalletDto extends ApiBaseProp {
  data: {
    gold: number;
    silver: number;
    bp: string;
    /** 硬币数 */
    metal: number;
  };
}

/** 获取有勋章的直播间 */
export interface FansMedalDto extends PureDataProp {
  data: {
    medalCount: number;
    count: number;
    /** 你的名字 */
    name: string;
    pageinfo: {
      totalpages: number;
      curPage: number;
    };
    fansMedalList: {
      /** 你的id */
      uid: number;
      target_id: number;
      medal_id: number;
      /** 经验 */
      score: number;
      level: number;
      intimacy: number;
      status: number;
      source: number;
      receive_channel: number;
      is_receive: number;
      master_status: number;
      // receive_time: string;
      // today_intimacy: number;
      // last_wear_time: number;
      // is_lighted: number;
      // medal_level: number;
      // next_intimacy: number;
      // day_limit: number;
      /** 勋章名 */
      // medal_name: number;
      // master_available: number;
      // guard_type: number;
      // lpl_status: number;
      // can_delete: boolean;
      /** up主名字 */
      target_name: string;
      /** up主头像 */
      // target_face: string;
      // live_stream_status: number;
      // icon_code: number;
      // icon_text: string;
      // rank: string;
      // medal_color: string;
      // medal_color_start: number;
      // medal_color_end: number;
      // guard_level: number;
      // medal_color_border: number;
      /** 下面三个都是今日已经获得亲密度 */
      todayFeed: number;
      // today_feed: number;
      // dayLimit: number;
      // uname: string;
      color: number;
      medalName: string;
      guard_medal_title: string;
      anchorInfo: object;
      roomid: number;
    }[];
  };
}

/** 直播礼物背包列表 */
export interface LiveGiftBagListDto extends ApiBaseProp {
  data: {
    list: {
      bag_id: number;
      /** 1 辣条 30607 小星星 */
      gift_id: number;
      gift_name: string;
      gift_num: number;
      gift_type: number;
      /** 到期时间 unix 时间戳 */
      expire_at: number;
      /** 还剩时间 eg：1天 */
      corner_mark: string;
      corner_color: string;
      count_map: { num: number; text: string }[];
      bind_roomid: number;
      bind_room_text: string;
      type: number;
      // card_image: string;
      // card_gif: string;
      // card_id: number;
      // card_record_id: number;
      // is_show_send: boolean;
    }[];
    time: string;
  };
}

/** 赠送礼物后的响应 */
export interface BagSendResDto extends ApiBaseProp {
  data: {
    uid: number;
    uname: string;
    guard_level: number;
    ruid: number;
    room_id: number;
    total_coin: number;
    pay_coin: number;
    blow_switch: number;
    send_tips: string;
    gift_id: number;
    gift_type: number;
    gift_name: string;
    gift_num: number;
    gift_action: string;
    gift_price: number;
    coin_type: string;
  };
}

export interface LiveHeartEDto extends ApiBaseProp {
  data: {
    timestamp: number;
    heartbeat_interval: number;
    secret_key: string;
    secret_rule: LiveHeartRuleId;
    patch_status?: number;
    reason?: string[];
  };
}
