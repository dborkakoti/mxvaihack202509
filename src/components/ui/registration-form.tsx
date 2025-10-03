'use client';

import { useState } from 'react';
import { RegistrationRecord } from '@/lib/types';

interface RegistrationFormProps {
    onSuccess: (data: RegistrationRecord) => void;
}

const RegistrationForm = ({ onSuccess }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    tshirt_size: '',
    dietary: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  const validate = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!formData.name) tempErrors.name = 'Name is required';
    if (!formData.email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email is invalid';
    }
    if (!formData.phone) {
      tempErrors.phone = 'Phone is required';
    } else if (!/^\d+$/.test(formData.phone)) {
      tempErrors.phone = 'Phone number must contain only digits';
    }
    if (!formData.tshirt_size) tempErrors.tshirt_size = 'T-shirt size is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmissionError(null);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const result: RegistrationRecord = await response.json();
      if (result) {
        localStorage.setItem('registration_id', result.id);
        localStorage.setItem('registration_record', JSON.stringify(result));
      }
      setToast({ show: true, message: 'Registration successful!' });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);

      if (onSuccess) {
        onSuccess(result);
      }

    } catch (error) {
        if (error instanceof Error) {
            setSubmissionError(error.message);
        } else {
            setSubmissionError('An unknown error occurred');
        }
      setToast({ show: true, message: 'Registration failed!' });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {toast.show && <div className="p-4 bg-green-100 text-green-700 rounded">{toast.message}</div>}
      {submissionError && <div className="p-4 bg-red-100 text-red-700 rounded">{submissionError}</div>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
        {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch / Region</label>
        <input type="text" name="branch" id="branch" value={formData.branch} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="tshirt_size" className="block text-sm font-medium text-gray-700">T-shirt Size</label>
        <select name="tshirt_size" id="tshirt_size" value={formData.tshirt_size} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.tshirt_size ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}>
          <option value="">Select a size</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
        {errors.tshirt__size && <p className="mt-2 text-sm text-red-600">{errors.tshirt_size}</p>}
      </div>
      <div>
        <label htmlFor="dietary" className="block text-sm font-medium text-gray-700">Dietary Preferences</label>
        <input type="text" name="dietary" id="dietary" value={formData.dietary} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <button type="submit" disabled={submitting} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
          {submitting ? 'Submitting...' : 'Register'}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;