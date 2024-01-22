"use client"

export default function PersonalInformation({ token }: { token: string }) {

return(
<form className="space-y-6" action="/update-profile" method="POST">
<div className="flex justify-between items-center py-5">
  <div className="text-2xl  font-bold text-gray-900">Personal Information</div>
  <button type="submit" className="bg-auspak-dark-grey text-white py-2 px-20 rounded-md hover:bg-auspak-green-dark hover:bg-auspak-medium-grey">Save</button>
</div>
  <div className="flex justify-between space-x-3">
    <div className="flex-1">
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        First name
      </label>
      <div className="mt-1">
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="given-name"
          required
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auspak-green focus:border-auspak-green sm:text-sm"
        />
      </div>
    </div>
    <div className="flex-1">
      <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
        Last name
      </label>
      <div className="mt-1">
        <input
          id="lastname"
          name="lastname"
          type="text"
          autoComplete="family-name"
          required
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auspak-green focus:border-auspak-green sm:text-sm"
        />
      </div>
    </div>
  </div>

  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
      Email address
    </label>
    <div className="mt-1">
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auspak-green focus:border-auspak-green sm:text-sm"
      />
    </div>
  </div>

  <div>
    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
      Address
    </label>
    <div className="mt-1">
      <input
        id="address"
        name="address"
        type="address"
        autoComplete="address"
        required
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auspak-green focus:border-auspak-green sm:text-sm"
      />
    </div>
  </div>

  <div>
    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
      Phone number
    </label>
    <div className="mt-1">
      <input
        id="phone_number"
        name="phone_number"
        type="phone_number"
        autoComplete="phone_number"
        required
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auspak-green focus:border-auspak-green sm:text-sm"
      />
    </div>
  </div>


  {/* <div>
    <button
      type="submit"
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-auspak-green hover:bg-auspak-dark-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-auspak-green"
    >
      Save Settings
    </button>
  </div> */}
</form>
)
}