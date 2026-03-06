import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

var client = new DynamoDBClient({
  region: process.env.DYNAMO_REGION || "eu-central-1",
  credentials: {
    accessKeyId: process.env.DYNAMO_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.DYNAMO_SECRET_ACCESS_KEY || "",
  },
});

export var db = DynamoDBDocumentClient.from(client);

export async function getVinCache(vin: string) {
  try {
    var res = await db.send(new GetCommand({ TableName: "vin_cache", Key: { vin: vin } }));
    return res.Item || null;
  } catch (e) {
    console.error("DynamoDB get error:", e);
    return null;
  }
}

export async function putVinCache(item: Record<string, any>) {
  try {
    await db.send(new PutCommand({ TableName: "vin_cache", Item: item }));
    return true;
  } catch (e) {
    console.error("DynamoDB put error:", e);
    return false;
  }
}

export async function getWmi(wmi: string) {
  try {
    var res = await db.send(new GetCommand({ TableName: "wmi_directory", Key: { wmi: wmi } }));
    return res.Item || null;
  } catch (e) {
    console.error("DynamoDB WMI get error:", e);
    return null;
  }
}

export async function putWmi(item: Record<string, any>) {
  try {
    await db.send(new PutCommand({ TableName: "wmi_directory", Item: item }));
    return true;
  } catch (e) {
    console.error("DynamoDB WMI put error:", e);
    return false;
  }
}
