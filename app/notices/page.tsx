\
import Button from "../components/Button/Button";
import { SectionHeader } from "../components/SectionHeader";
import Container from "../components/UI/Container";
import { primaryBgColor, primaryBorderColor } from "../sample/color/page";

export default function Page() {
  const data = [
    {
      id: "120",
      title: "공지사항 제목이 들어갑니다.",
      date: "2025-11-14",
    },
  ];
  return (
    <Container>
      <SectionHeader title="공지사항" description="공지사항을 안내합니다." />
      <div>
        <p
          className={`pb-2 border-b text-base font-bold ${primaryBorderColor.Color2[0]}`}
        >
          총 120개
        </p>
        <table className="w-full border-collapse">
          <thead className={`bg-white text-black text-sm uppercase`}>
            <tr>
              <th className="py-3 px-4 text-center text-sm">NO</th>
              <th className="py-3 px-4 text-center text-sm">제목</th>
              <th className="py-3 px-4 text-center text-sm">작성일</th>
            </tr>
          </thead>

          <tbody className="divide-y text-sm bg-[#ffffff]">
            {data.map((notice, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 transition-colors text-center"
              >
                <td className="p-4 font-medium text-gray-800">{notice.id}</td>
                <td className="p-4 text-gray-600">{notice.title}</td>
                <td className="p-4">{notice.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
