import Link from "next/link";
import { Icon } from "../Icon/Icon";

export default function NoticeList({ data }) {
  const tableHeaders = [
    {
      label: "NO",
    },
    {
      label: "제목",
    },
    {
      label: "작성일",
    },
  ];
  return (
    <>
      <table className="w-full border-collapse">
        <thead className="bg-[#FAFAFA] border-b border-b-gray-100 text-black text-sm uppercase">
          <tr>
            {tableHeaders.map((header) => (
              <th
                className="py-3 px-4 text-center text-base"
                key={header.label}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y text-sm bg-[#ffffff] ">
          {data.map((notice) => (
            <>
              {notice.type === "key" && (
                <tr
                  key={`important-${notice.id}`}
                  className="bg-[#FAFAFA] hover:bg-gray-50 transition-colors text-center"
                >
                  <td className="items-center py-6 text-sm text-gray-800 font-semibold">
                    <div className="">
                      <Icon
                        type="bellFilled"
                        size={18}
                        className="inline mb-0.5"
                      />
                      <span className="pl-2">중요 공지</span>
                    </div>
                  </td>
                  <td className="py-6 px-3 text-sm text-gray-600 font-semibold text-left">
                    <Link href={`/notice/${notice.id}`}>{notice.title}</Link>
                  </td>
                  <td className="py-6 text-sm">{notice.date}</td>
                </tr>
              )}
              <tr
                key={notice.id}
                className="hover:bg-gray-50 transition-colors text-center"
              >
                <td className="py-6 text-sm text-gray-800">{notice.id}</td>
                <td className="py-6 px-3 text-sm text-gray-600 font-semibold text-left">
                  <Link href={`/notices/${notice.id}`}>{notice.title}</Link>
                </td>
                <td className="py-6 text-sm">{notice.date}</td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </>
  );
}
