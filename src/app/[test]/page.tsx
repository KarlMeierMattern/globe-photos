"use client";

import { useParams } from "next/navigation";

export default function TestPage() {
  const params = useParams();
  const testId = params.test;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Test Page</h1>
      <p className="mt-2">Test ID: {testId}</p>
    </div>
  );
}
