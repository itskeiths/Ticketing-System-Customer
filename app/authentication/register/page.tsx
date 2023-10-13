'use client';
import React from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/app/authentication/firebase';
import { useToast } from '@/components/ui/use-toast';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>();
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { name, email, password, confirmPassword } = data;

    // Validate password match
    if (password !== confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data to Firestore (optional)
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: name,
        email: email,
      });

      // Show success toast
      toast({
        title: 'Registration successful!',
        variant: 'default',
      });

      // Redirect to the main page
      router.push('/Main_page');
    } catch (error) {
      // Show error toast
      toast({
        title: 'Registration failed',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h1 className="text-center text-3xl font-bold mb-4">Register</h1>
          <h3 className="text-center p-4">Enjoy your support journey with us!</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your Name..."
            />
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your email..."
            />
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', { required: 'Confirm Password is required' })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.confirmPassword && (
              <span className="text-red-500">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register