const xlsx = require("xlsx");
const path = require("path");
const Jenkins = require("jenkins");

const excelFilePath = path.join(__dirname, "1234.xls");
const workbook = xlsx.readFile(excelFilePath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

const excelData = xlsx.utils.sheet_to_json(worksheet);

async function main() {
  const jenkins = new Jenkins({
    baseUrl: 'http://xiaochen:xiaochen@152.136.116.251:18081',
    promisify: true,
  });

  try {
    // 获取所有任务列表并等待完成
    const jobList = await jenkins.job.list();

    // 遍历任务列表并逐个删除
    for (const jobName of jobList) {
      try {
        await jenkins.job.destroy(jobName);
        console.log(`Jenkins job '${jobName}' deleted successfully.`);
      } catch (destroyErr) {
        console.error(`Error deleting Jenkins job '${jobName}': ${destroyErr.message}`);
      }
    }
  } catch (err) {
    console.error('Error listing Jenkins jobs:', err.message);
  }
}
main();
