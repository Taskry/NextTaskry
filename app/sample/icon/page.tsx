import { Icon } from '../../components/Icon/Icon';

const iconCategories = {
  theme: ['sun', 'moon', 'sunMoon'],
  users: ['users', 'userPlus', 'userCircle', 'userCheck'],
  crud: ['pencil', 'edit', 'trash'],
  calendarAndClock: [
    'calendar',
    'calendarPlus',
    'calendarCheck',
    'calendarShare',
    'calendarStar',
    'calendarEvent',
    'clock'
  ],
  search: ['search', 'filter'],
  project: ['board', 'notes', 'checkList', 'details', 'kanban', 'squareCheck'],
  circle: [
    'circleCheck',
    'circleInfo',
    'circlePlus',
    'circlePlusFilled',
    'circleCheckFilled',
    'progressAlert'
  ],
  etc: ['x', 'plus', 'arrowDown', 'eye', 'imageSquare', 'speakerPhone', 'dot', 'description']
};

function IconPage() {
  return (
    <div>
      <div className="p-2 mb-5 border-1 border-main-300">
        {'<Icon type="sun" size="24" color="red" className="text-gray-500 "/>'}
      </div>
      {Object.values(iconCategories).map((category, index) => (
        <div key={index} className="grid grid-cols-10 gap-2 mb-6">
          {category.map((type) => {
            return (
              <div key={type}>
                <Icon type={type} className="text-main-200 " />
                <div className="text-center">{type}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default IconPage;
