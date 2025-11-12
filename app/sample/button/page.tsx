import Button from "../../components/Button/Button";

export default function Page() {
  type basicButtonType = {
    text?: string;
    variant?:
      | "basic"
      | "warning"
      | "success"
      | "bgMain100"
      | "bgMain200"
      | "bgMain300"
      | "bgMain400"
      | "bgMain500"
      | "bgMain600"
      | "lightMain40"
      | "lightRed40"
      | "lightRed100"
      | "white";
    size?: "sm" | "base" | "full";
    radius?: "sm" | "lg" | "xl" | "full";
    textColor?: "txtMain600" | "white" | "lightRed100";
    icon?: string;
    iconSize?: "sm";
  };
  // 기본 버튼에 대한 샘플
  const basicData: basicButtonType[] = [
    { text: "취소", variant: "basic", textColor: "txtMain600" },
    { text: "삭제", variant: "warning", textColor: "white" },
    { text: "추가", variant: "success", textColor: "white" },
    { text: "등록", variant: "bgMain300", textColor: "white" },
    { text: "목록", variant: "bgMain100", textColor: "txtMain600" },
    { text: "수정하기", variant: "basic", textColor: "txtMain600" },
  ];
  // 특정 버튼에 대한 샘플
  const particularData: basicButtonType[] = [
    {
      text: "새 프로젝트",
      icon: "plus",
      variant: "bgMain400",
      size: "base",
      radius: "lg",
    },
    {
      text: "Google로 시작하기",
      icon: "google",
      variant: "bgMain400",
      size: "base",
      radius: "lg",
    },
    {
      text: "프로젝트 수정",
      icon: "edit",
      variant: "bgMain400",
      size: "base",
      radius: "lg",
    },
    {
      text: "프로젝트 생성하기",
      icon: "edit",
      variant: "bgMain400",
      size: "base",
      radius: "lg",
    },
    {
      text: "새 공지사항",
      icon: "plus",
      iconSize: "sm",
      variant: "bgMain300",
      size: "sm",
      radius: "sm",
    },
  ];
  // 네비게이션에 대한 샘플
  const navigationsData: basicButtonType[] = [
    { text: "칸반보드", icon: "board" },
    { text: "메모", icon: "notes" },
    { text: "프로젝트", icon: "details" },
    { text: "내 일정", icon: "board" },
    { text: "캘린더", icon: "calendar" },
  ];
  return (
    <section>
      <div className="p-2 mb-5 border-1 border-main-300">
        {
          '버튼: <Button radius="lg" variant="bgMain100" size="base" textColor="white">텍스트</Button>'
        }
        <br />
        {
          '아이콘: <Button icon="trash" radius="full" size="full" variant="lightRed40"/></Button>'
        }
      </div>
      <div className="px-7">
        {/* 기본 버튼 */}
        <div className="mb-8">
          <h1 className="mb-3 text-xl font-semibold">기본 버튼</h1>
          <div className="flex gap-2">
            {basicData.map((item) => {
              return (
                <Button
                  radius="lg"
                  variant={item.variant}
                  size="base"
                  textColor={item.textColor}
                  key={item.text}
                >
                  {item.text}
                </Button>
              );
            })}
          </div>
        </div>
        {/* 특정 버튼 */}
        <div className="mb-8">
          <h1 className="mb-3 text-xl font-semibold">특정 버튼</h1>
          <div className="flex items-center flex-wrap gap-2 mb-4">
            {particularData.map((item) => {
              return (
                <Button
                  radius={item.radius}
                  icon={item.icon}
                  key={item.text}
                  variant={item.variant}
                  size={item.size}
                  textColor="white"
                  iconSize={item.iconSize}
                >
                  {item.text}
                </Button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              icon="edit"
              radius="full"
              size="full"
              variant="lightMain40"
            />
            <Button
              icon="trash"
              radius="full"
              size="full"
              variant="lightRed40"
              textColor="lightRed100"
            />
          </div>
        </div>
        {/* 네비게이션 */}
        <div className="mb-8">
          <h1 className="mb-3 text-xl font-semibold">네비게이션</h1>
          <div className="flex items-center gap-2 ">
            {navigationsData.map((item) => {
              return (
                <Button
                  variant="lightMain40"
                  size="sm"
                  textColor="txtMain600"
                  icon={item.icon}
                  iconSize="sm"
                  key={item.text}
                >
                  {item.text}
                </Button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 ">
            <Button
              variant="white"
              border="basic"
              borderColor="bgMain300"
              color="bgMain300"
            >
              공지사항 관리
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
