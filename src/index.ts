import { warpLog } from './utils/log';
import { JuryTask, TaskModule } from './config/globalVar';
import { apiDelay, sendMessage, getPRCDate } from './utils';
import { random } from 'lodash';
import bili, { doOneJuryVote, loginTask } from './service';
import { offFunctions } from './config/configOffFun';
import updateTrigger from './utils/updateTrigger';

async function baseTasks(cb?: () => void) {
  try {
    await loginTask();
  } catch (error) {
    console.log('登录失败: ', error);
    await sendMessage('bili每日任务失败', TaskModule.appInfo);
    return '未完成';
  }

  const biliArr = offFunctions([...Object.values(bili)]);

  for (const asyncFun of biliArr) {
    await asyncFun();
    await apiDelay();
  }

  if (cb) {
    await cb();
  }

  await sendMessage('bili每日任务完成', TaskModule.appInfo);
  return '完成';
}

exports.main_handler = async (event, _context) => {
  //必须得写在main_handler中,否则serverless无效
  console.log = warpLog();

  // 只有serverless才有event
  if (!event) {
    return await baseTasks();
  }
  if (event.Message === getPRCDate().getDate().toString()) {
    return '今日重复执行';
  }

  if (event.TriggerName === 'jury-timer') {
    if (!JuryTask.isRun && JuryTask.noRunMessage === '今日的案件已经审核完成') {
      console.log(JuryTask.noRunMessage, JuryTask.dailyCompleteCount++);
      return '跳过执行';
    }

    try {
      // 到这里了说明不会是今日已经审核完成,如果是未找到案件,那就应该继续
      JuryTask.isRun = true;
      // 当循环中审核完成或没有按键就退出此次执行
      while (JuryTask.isRun) {
        await apiDelay();
        await doOneJuryVote(random(12000, 30000));
      }
    } catch (error) {
      console.log(error);
    }

    if (JuryTask.dailyCompleteCount === 1 && JuryTask.caseNum > 0) {
      await updateTrigger('jury');
      await sendMessage('bili风纪任务完成', TaskModule.appInfo);
    }

    return '评审任务';
  }

  return await baseTasks(updateTrigger);
};
