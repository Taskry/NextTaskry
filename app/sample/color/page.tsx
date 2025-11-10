function ColorPage() {
  const primaryBgColor = {
    color1: [
      'bg-main-100',
      'bg-main-200',
      'bg-main-300',
      'bg-main-400',
      'bg-main-500',
      'bg-main-600',
      'bg-main-700'
    ],
    Color2: [
      'bg-gray-100',
      'bg-gray-200',
      'bg-gray-300',
      'bg-gray-400',
      'bg-gray-500',
      'bg-gray-600',
      'bg-gray-700'
    ]
  };

  const primaryTextColor = {
    color1: [
      'text-main-100',
      'text-main-200',
      'text-main-300',
      'text-main-400',
      'text-main-500',
      'text-main-600',
      'text-main-700'
    ],
    Color2: [
      'text-gray-100',
      'text-gray-200',
      'text-gray-300',
      'text-gray-400',
      'text-gray-500',
      'text-gray-600',
      'text-gray-700'
    ]
  };

  const primaryBorderColor = {
    color1: [
      'border-main-100',
      'border-main-200',
      'border-main-300',
      'border-main-400',
      'border-main-500',
      'border-main-600',
      'border-main-700'
    ],
    Color2: [
      'border-gray-100',
      'border-gray-200',
      'border-gray-300',
      'border-gray-400',
      'border-gray-500',
      'border-gray-600',
      'border-gray-700'
    ]
  };

  const bgColorOpacity = {
    colorOpacity: [
      'bg-main-200',
      'bg-main-200/80',
      'bg-main-200/40',
      'bg-yellow-100',
      'bg-yellow-100/80',
      'bg-yellow-100/40'
    ],
    colorOpacity2: [
      'bg-red-100',
      'bg-red-100/80',
      'bg-red-100/40',
      'bg-blue-100',
      'bg-blue-100/80',
      'bg-blue-100/40'
    ],
    colorOpacity3: ['bg-green-100', 'bg-green-100/80', 'bg-green-100/40']
  };

  const borderColorOpacity = {
    colorOpacity: [
      'border-main-200',
      'border-main-200/80',
      'border-main-200/40',
      'border-yellow-100',
      'border-yellow-100/80',
      'border-yellow-100/40'
    ],
    colorOpacity2: [
      'border-red-100',
      'border-red-100/80',
      'border-red-100/40',
      'border-blue-100',
      'border-blue-100/80',
      'border-blue-100/40'
    ],
    colorOpacity3: ['border-green-100', 'border-green-100/80', 'border-green-100/40']
  };

  const textColorOpacity = {
    colorOpacity: [
      'text-main-200',
      'text-main-200/80',
      'text-main-200/40',
      'text-yellow-100',
      'text-yellow-100/80',
      'text-yellow-100/40'
    ],
    colorOpacity2: [
      'text-red-100',
      'text-red-100/80',
      'text-red-100/40',
      'text-blue-100',
      'text-blue-100/80',
      'text-blue-100/40'
    ],
    colorOpacity3: ['text-green-100', 'text-green-100/80', 'text-green-100/40']
  };

  return (
    <div>
      <div>
        <div className="mb-3 text-xl font-semibold">primaryBgColor</div>
        {Object.values(primaryBgColor).map((category, index) => (
          <div key={index} className="flex gap-2 mb-4">
            {category.map((color) => (
              <div
                key={color}
                className={`
                  ${color}
                  w-40
                  h-20
                  rounded-lg
                  flex 
                  items-center 
                  justify-center
                  font-semibold`}
              >
                {`${color}`}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <div className="mb-3 text-xl font-semibold">primaryBorderColor</div>
        {Object.values(primaryBorderColor).map((category, index) => (
          <div key={index} className="flex gap-2 mb-4">
            {category.map((color) => (
              <div
                key={color}
                className={`
                  ${color}
                  w-40
                  h-20
                  border-2
                  rounded-lg
                  flex 
                  items-center 
                  justify-center
                  font-semibold`}
              >
                {`${color}`}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <div className="mb-3 text-xl font-semibold">primaryTextColor</div>
        {Object.values(primaryTextColor).map((category, index) => (
          <div key={index} className="flex gap-2 mb-4">
            {category.map((color) => (
              <div
                key={color}
                className={`
                  ${color}
                  w-40
                  h-15
                  rounded-lg
                  flex 
                  items-center 
                  justify-center
                  font-semibold`}
              >
                {`${color}`}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <div className="mb-3 text-xl font-semibold">bgColorOpacity</div>
        {Object.values(bgColorOpacity).map((category, index) => (
          <div key={index} className="flex gap-2 mb-4">
            {category.map((color) => (
              <div
                key={color}
                className={`
                  ${color}
                  w-40
                  h-20
                  rounded-lg
                  flex 
                  items-center 
                  justify-center
                  font-semibold`}
              >
                {`${color}`}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <div className="mb-3 text-xl font-semibold">borderColorOpacity</div>
        {Object.values(borderColorOpacity).map((category, index) => (
          <div key={index} className="flex gap-2 mb-4">
            {category.map((color) => (
              <div
                key={color}
                className={`
                  ${color}
                  w-40
                  h-20
                  border-2
                  rounded-lg
                  flex 
                  items-center 
                  justify-center
                  font-semibold`}
              >
                {`${color}`}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <div className="mb-3 text-xl font-semibold">textPrimaryColor</div>
        {Object.values(textColorOpacity).map((category, index) => (
          <div key={index} className="flex gap-2 mb-4">
            {category.map((color) => (
              <div
                key={color}
                className={`
                  ${color}
                  w-40
                  h-15
                  rounded-lg
                  flex 
                  items-center 
                  justify-center
                  font-semibold`}
              >
                {`${color}`}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ColorPage;
