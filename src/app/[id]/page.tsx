"use client";

import React from "react";

export default function TestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Test Page</h1>
      <p className="mt-2">Test ID: {id}</p>
    </div>
  );
}