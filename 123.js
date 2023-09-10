const xlsx = require("xlsx");
const path = require("path");
const Jenkins = require("jenkins");

const excelFilePath = path.join(__dirname, "1234.xls");
const workbook = xlsx.readFile(excelFilePath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

const data = xlsx.utils.sheet_to_json(worksheet);

async function main() {
  try {
    for (let rowNumber = 0; rowNumber < data.length; rowNumber++) {
      const row = data[rowNumber];
      const { 服务器: serverName, 应用名: appName, 位置: installPath } = row;
      await createJenkinsJob(appName, serverName, installPath);
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

async function createJenkinsJob(appName, serverName, installPath) {
  const jenkins = new Jenkins({
    baseUrl: "http://xiaochen:xiaochen@152.136.116.251:18081",
    // 是否支持Promise链式调用
    promisify: true,
  });

  const jobConfig = `
    <project>
      <actions/>
      <description>Auto-generated Jenkins Job</description>
      <keepDependencies>false</keepDependencies>
      <properties/>
      <scm class="hudson.scm.NullSCM"/>
      <builders>
        <hudson.tasks.Shell>
          <command>cp /home/jar/${appName} ${serverName}:${installPath}/${appName}</command>
        </hudson.tasks.Shell>
      </builders>
    </project>
  `;
  try {
    const jobInfo = await jenkins.job.get(`${appName}_Deployment`);
    console.log(`Jenkins job ${appName}_Deployment already exists.`);
    return;
  } catch (error) {}

  jenkins.job.create(`${appName}_Deployment`, jobConfig, (err) => {
    if (err) {
      console.error("Error creating Jenkins job:", "1111");
    } else {
      console.log("Jenkins job created successfully.");
    }
  });
}

main();
