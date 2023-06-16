import { Query, Resolver } from "type-graphql";
import {
  Bucket,
  ChartData,
  ChartDataKey,
  DataSet,
  Test,
  TestContentType,
  TestStatus,
} from "./schema";
import { v4 as uuidv } from "uuid";
import { mockDbRequest, generateRandomColor } from "../utils/helper";

@Resolver()
export class MainResolver {
  @Query(() => [ChartData])
  async getChartDatas(): Promise<ChartData[]> {
    // Get Test data
    const allTests: Test[] = await mockDbRequest();
    const testsByProjectAnalysis = new Map<string, Test[]>();
    // Group Test objects by {projectId}-{analysisId} values
    for (const test of allTests) {
      // Create the key
      let projectAnalysisKey = `${test.project}-${test.analysis}`;
      // Check if key exists in map, set if not
      if (!testsByProjectAnalysis.has(projectAnalysisKey)) {
        testsByProjectAnalysis.set(projectAnalysisKey, []);
      }
      // Populate related key with objects
      testsByProjectAnalysis.get(projectAnalysisKey)?.push(test);
    }
    const buckets: Bucket[] = [];
    const chartDatas: ChartData[] = [];

    for (const [projectAnalysisKey, tests] of testsByProjectAnalysis) {
      // Get {ProjectId} and {AnalysisId}
      const keys = projectAnalysisKey.split("-");
      // Create a bucket for every {ProjectId} - {AnalysisId} (Aggregate Test -> Bucket)
      buckets.push({
        id: uuidv(),
        project: keys[0],
        analysis: keys[1],
        updatedAt: new Date(),
      });
      const testsByKey = new Map<string, Test[]>();
      // Group Test objects with 'Number' content type by their {Key}
      for (const test of tests) {
        if (test.contentType === TestContentType.NUMBER) {
          // Check if key exists in map, set if not
          if (!testsByKey.has(test.key)) {
            testsByKey.set(test.key, []);
          }
          // Populate related key
          testsByKey.get(test.key)?.push(test);
        }
      }
      // Group Test objects of each key by status and aggregate into ChartData
      for (const [testKey, keyTests] of testsByKey) {
        const keyTestsByStatus = new Map<string, Test[]>();
        // Group Test objects by status
        keyTests.forEach((f) => {
          const strStatus = TestStatus[TestStatus[f.status as TestStatus]];
          if (!keyTestsByStatus.has(strStatus)) {
            // Check if key exists in map, set if not
            keyTestsByStatus.set(strStatus, []);
          }
          // Populate related key
          keyTestsByStatus.get(strStatus)?.push(f);
        });
        const dataSets: DataSet[] = [];
        // Create dataset for each status
        for (const [status, statusTests] of keyTestsByStatus) {
          dataSets.push({
            label: status,
            color: generateRandomColor(),
            // Create data array for each test of status
            data: statusTests.map((m) => [
              m.createdAt.toJSON(),
              Number(m.value).toString(),
            ]),
          });
        }
        // Populate result array
        chartDatas.push({
          id: uuidv(),
          project: keys[0],
          analysis: keys[1],
          updatedAt: new Date(),
          key: testKey as ChartDataKey,
          type: "",
          title: "Tests in a project analysis by keys",
          xAxis: "Updated Date",
          yAxis: "Value",
          dataSets: dataSets,
        });
      }
    }
    return chartDatas;
  }
}
