import { Test, TestContentType, TestStatus } from "../graphql/schema";

// Mock db behaviour to get example data
export const mockDbRequest = async (): Promise<Test[]> => {
  return new Promise((resolve, response) => {
    setTimeout(
      () =>
        resolve([
          {
            id: "berke",
            project: "1",
            analysis: "2",
            document: "3",
            key: "DetailLines",
            value: 2,
            contentType: TestContentType.NUMBER,
            status: TestStatus.SUCCESSFULL,
            message: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "berke",
            project: "1",
            analysis: "2",
            document: "3",
            key: "FileSize",
            value: 2,
            contentType: TestContentType.NUMBER,
            status: TestStatus.SUCCESSFULL,
            message: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
      200
    );
  });
};
// Generate random css color code. (e.g #1A2B3C)
export const generateRandomColor = () =>
  Math.floor(Math.random() * 16777215).toString(16);
