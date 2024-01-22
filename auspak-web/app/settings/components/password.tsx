"use client"

export default function PasswordForm({ token }: { token: string }) {

return(
<form className="space-y-6" action="/update-profile" method="POST">
<div className="flex justify-between items-center py-5">
  <div className="text-2xl  font-bold text-gray-900">Change Password</div>
  <button type="submit" className="bg-auspak-dark-grey text-white py-2 px-20 rounded-md hover:bg-auspak-green-dark hover:bg-auspak-medium-grey">Save</button>
</div>
<div>
    <label htmlFor="old_password" className="block text-sm font-medium text-gray-700">
      Old password
    </label>
    <div className="mt-1">
      <input
        id="old_password"
        name="old_password"
        type="old_password"
        autoComplete="old_password"
        required
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auspak-green focus:border-auspak-green sm:text-sm"
      />
    </div>
  </div>

  <div>
    <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
      New password
    </label>
    <div className="mt-1">
      <input
        id="new_password"
        name="new_password"
        type="new_password"
        autoComplete="new_password"
        required
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auspak-green focus:border-auspak-green sm:text-sm"
      />
    </div>
  </div>
</form>
)
}