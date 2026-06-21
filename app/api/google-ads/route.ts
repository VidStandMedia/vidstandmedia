import { getToken } from "next-auth/jwt";

export async function GET(request: Request) {
  try {
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.accessToken) {
      return Response.json(
        { error: "No access token found" },
        { status: 401 }
      );
    }

    const response = await fetch(
      "https://googleads.googleapis.com/v17/customers:listAccessibleCustomers",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "developer-token":
            process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
        },
      }
    );

    const text = await response.text();

    return Response.json({
      status: response.status,
      statusText: response.statusText,
      body: text,
    });
  } catch (error) {
    return Response.json(
      {
        error: String(error),
      },
      { status: 500 }
    );
  }
}