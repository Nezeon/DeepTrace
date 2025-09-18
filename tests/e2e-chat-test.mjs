// Node 18+ script using global fetch
// Runs automated POST/GET/DELETE against the running backend on PORT=5000

const base = process.env.BASE_URL || "http://localhost:5000";

function randId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

async function req(method, path, body) {
  const url = `${base}${path}`;
  const init = { method, headers: { "Content-Type": "application/json" } };
  if (body) init.body = JSON.stringify(body);
  const res = await fetch(url, init);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = undefined;
  }
  return { status: res.status, ok: res.ok, bodyText: text, body: json };
}

async function main() {
  const report = { base, steps: [] };
  try {
    // Health
    const health = await req("GET", "/api/health");
    report.health = health;

    const caseId = randId("case");
    const userId = randId("user");
    report.ids = { caseId, userId };

    // A) POST /api/chats/case
    const A = await req("POST", "/api/chats/case", {
      caseId,
      userId,
      message: "hello A",
      metadata: { source: "testA" },
    });
    report.steps.push({ name: "A_POST_case", status: A.status, snippet: (A.bodyText || "").slice(0, 200) });
    const idA = A.body?._id;

    // B) GET /api/chats/case/:caseId
    const B = await req("GET", `/api/chats/case/${caseId}`);
    report.steps.push({ name: "B_GET_case", status: B.status, count: Array.isArray(B.body) ? B.body.length : undefined, snippet: (B.bodyText || "").slice(0, 200) });

    // C) POST /api/chat (alias)
    const C = await req("POST", "/api/chat", {
      caseId,
      userId,
      message: "hello C",
      metadata: { source: "testC" },
    });
    report.steps.push({ name: "C_POST_alias", status: C.status, snippet: (C.bodyText || "").slice(0, 200) });
    const idC = C.body?._id;

    // D) GET /api/chat/:caseId (alias)
    const D = await req("GET", `/api/chat/${caseId}`);
    report.steps.push({ name: "D_GET_alias", status: D.status, count: Array.isArray(D.body) ? D.body.length : undefined, snippet: (D.bodyText || "").slice(0, 200) });

    // E) GET /api/chats/:userId
    const E = await req("GET", `/api/chats/${userId}`);
    report.steps.push({ name: "E_GET_user", status: E.status, count: Array.isArray(E.body) ? E.body.length : undefined, snippet: (E.bodyText || "").slice(0, 200) });

    // F) DELETE /api/chats/:id (delete idA if available, else idC)
    const deleteId = idA || idC;
    const F = deleteId ? await req("DELETE", `/api/chats/${deleteId}`) : { status: 0, ok: false, bodyText: "No ID to delete" };
    report.steps.push({ name: "F_DELETE_byId", status: F.status, snippet: (F.bodyText || "").slice(0, 200) });

    // G) GET /api/chats/case/:caseId (post-delete)
    const G = await req("GET", `/api/chats/case/${caseId}`);
    report.steps.push({ name: "G_GET_case_after", status: G.status, count: Array.isArray(G.body) ? G.body.length : undefined, snippet: (G.bodyText || "").slice(0, 200) });

    const okSave = A.ok && C.ok;
    const okRetrieve = B.ok && D.ok && E.ok;
    const okDelete = F.status === 200;

    report.summary = {
      save: okSave,
      retrieve: okRetrieve,
      delete: okDelete,
    };

    report.success = okSave && okRetrieve && okDelete && health.ok;
  } catch (err) {
    report.success = false;
    report.error = String(err?.stack || err);
  }

  console.log(JSON.stringify(report, null, 2));
}

main();


