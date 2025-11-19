import Badge from "@/app/components/Badge/Badge";

export default function Page() {
  return (
    <>
      <h1>뱃지</h1>
      <div className="flex gap-1">
        <Badge type="dueSoon" />
        <Badge type="overDue" />
        <Badge type="done" />
        <Badge type="high" />
        <Badge type="normal" />
        <Badge type="low" />
      </div>
    </>
  );
}
