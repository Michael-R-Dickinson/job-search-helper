const MatchIndicator = () => (
  <div className="absolute top-4 right-4 z-10">
    <div className="px-2.5 py-1.5 bg-green-50 border border-green-100 rounded-full">
      <div className="flex items-center gap-1.5">
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="#16A34A" strokeWidth="1.5" />
          <path
            d="M8 4L5.5 7.5L4 6"
            stroke="#16A34A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xs font-medium text-green-700">96% Match</span>
      </div>
    </div>
  </div>
)

export default MatchIndicator
