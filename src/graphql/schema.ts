// Schema definitions for GraphQL
import {
  ObjectType,
  Field,
  ID,
  InterfaceType,
  registerEnumType,
} from "type-graphql";
import GraphQLJSON from "graphql-type-json";

export enum TestContentType {
  NUMBER = "number",
}
registerEnumType(TestContentType, { name: "TestContentType" });

export enum TestStatus {
  SUCCESSFULL = "SUCCESSFULL",
  FAILED = "FAILED",
}
registerEnumType(TestStatus, { name: "TestStatus" });

@ObjectType()
export class Test {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  project!: string;

  @Field(() => ID)
  analysis!: string;

  @Field(() => ID)
  document!: string;

  @Field()
  key!: string;

  @Field(() => GraphQLJSON)
  value!: any;

  @Field(() => TestContentType)
  contentType!: TestContentType;

  @Field(() => TestStatus)
  status!: TestStatus;

  @Field({ nullable: true })
  message?: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@InterfaceType()
export abstract class Bucket {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  project!: string;

  @Field(() => ID)
  analysis!: string;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType({ implements: Bucket })
export class ChartData implements Bucket {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  project!: string;

  @Field(() => ID)
  analysis!: string;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => ChartDataKey)
  key!: ChartDataKey;

  @Field()
  type!: string;

  @Field()
  title!: string;

  @Field()
  xAxis!: string;

  @Field()
  yAxis!: string;

  @Field(() => [DataSet])
  dataSets!: DataSet[];
}

@ObjectType()
export class DataSet {
  @Field()
  label!: string;

  @Field()
  color!: string;

  @Field(() => [[String]])
  data!: Array<Array<string>>;
}

@ObjectType()
export class Data {
  @Field(() => [String])
  values!: string[];
}

export enum ChartDataKey {
  DETAIL_LINES = "DetailLines",
  FILE_SIZE = "FileSize",
  LOADED_FAMILIES = "LoadedFamilies",
  // Add other chart data keys as needed
}
registerEnumType(ChartDataKey, { name: "ChartDataKey" });
