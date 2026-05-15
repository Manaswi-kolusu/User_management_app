import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

function User() {
  let { state } = useLocation();
  let navigate = useNavigate();

  // Local state to store user data (allows immediate UI update on edit)
  let [user, setUser] = useState(state?.user || {});
  let [isEditing, setIsEditing] = useState(false);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '', // Format date for input
      mobileNumber: user.mobileNumber
    }
  });

  const deleteUser = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      setLoading(true);
      let res = await fetch(`http://localhost:5000/user-api/users/${user._id}`, {
        method: "DELETE"
      });
      if (res.status === 200) {
        navigate("/users-list");
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const onUserEdit = async (updatedData) => {
    try {
      setLoading(true);
      let res = await fetch(`http://localhost:5000/user-api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      if (res.status === 200) {
        let resObj = await res.json();
        setUser(resObj.payload);
        setIsEditing(false);
      } else {
        throw new Error("Failed to update user");
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-blue-500 text-3xl">Loading...</p>;
  if (error) return <p className="text-center text-red-500 text-3xl">{error.message}</p>;

  return (
    <div className="text-center max-w-lg mx-auto mt-10 p-10 bg-[#f5f5f7] rounded-2xl">
      {!isEditing ? (
        <>
          <h1 className="text-5xl font-bold text-[#1d1d1f] tracking-tight leading-none mb-6">User Details</h1>
          <div className="text-left bg-white p-6 rounded-xl shadow-sm mb-6">
            <p className="text-2xl mb-2"><span className="font-semibold text-gray-500">Name:</span> {user.name}</p>
            <p className="text-2xl mb-2"><span className="font-semibold text-gray-500">Email:</span> {user.email}</p>
            <p className="text-2xl mb-2"><span className="font-semibold text-gray-500">DOB:</span> {user.dateOfBirth?.split('T')[0]}</p>
            <p className="text-2xl mb-2"><span className="font-semibold text-gray-500">Mobile:</span> {user.mobileNumber}</p>
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={() => setIsEditing(true)} className="bg-[#0066cc] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#004499] transition-colors cursor-pointer text-lg tracking-tight">Edit</button>
            <button onClick={deleteUser} className="bg-red-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-red-600 transition-colors cursor-pointer text-lg tracking-tight">Delete</button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-5xl font-bold text-[#1d1d1f] tracking-tight leading-none mb-6">Edit User</h1>
          <form onSubmit={handleSubmit(onUserEdit)} className="text-left bg-white p-6 rounded-xl shadow-sm mb-6">
            <label className="block mb-2 font-semibold text-gray-500">Name</label>
            <input type="text" {...register("name")} className="mb-4 border w-full text-xl p-2 rounded" />
            
            <label className="block mb-2 font-semibold text-gray-500">Email</label>
            <input type="email" {...register("email")} className="mb-4 border w-full text-xl p-2 rounded" />
            
            <label className="block mb-2 font-semibold text-gray-500">Date of Birth</label>
            <input type="date" {...register("dateOfBirth")} className="mb-4 border w-full text-xl p-2 rounded" />
            
            <label className="block mb-2 font-semibold text-gray-500">Mobile Number</label>
            <input type="number" {...register("mobileNumber")} className="mb-6 border w-full text-xl p-2 rounded" />
            
            <div className="flex gap-4">
              <button type="submit" className="bg-[#0066cc] text-white flex-1 font-semibold px-5 py-3 rounded-full hover:bg-[#004499] transition-colors cursor-pointer text-lg tracking-tight">Save</button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-400 text-white flex-1 font-semibold px-5 py-3 rounded-full hover:bg-gray-500 transition-colors cursor-pointer text-lg tracking-tight">Cancel</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default User;
