'use client'
const TimeManagement = () => {
  return (
    <div className="w-full    bg-white   mx-auto">
      <form className="space-y-6">
        {/* Radio Section */}
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-medium">
            Are you willing to give Live Class for Queries?
          </label>
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input type="radio" name="liveClass" value="yes" className="accent-emerald-500" />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="liveClass" value="no" className="accent-emerald-500" />
              <span>No</span>
            </label>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium">
              How Frequent will you take the Class?
            </label>
            <select className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:border-emerald-500">
              <option>Select Frequency of Class</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Select Time</label>
            <select className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:border-emerald-500">
              <option>Select Class Duration</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium">Start Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">End Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Buttons */}
        
      </form>
    </div>
  );
};

export default TimeManagement;
