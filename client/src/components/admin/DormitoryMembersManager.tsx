import React, { useState } from 'react';
import { DormitoryMember } from '../../types';

interface DormitoryMembersManagerProps {
  members: DormitoryMember[];
  onMembersChange: (members: DormitoryMember[]) => void;
  propertyTitle: string;
  disabled?: boolean;
}

const DormitoryMembersManager: React.FC<DormitoryMembersManagerProps> = ({
  members,
  onMembersChange,
  propertyTitle,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingMember, setEditingMember] = useState<DormitoryMember>({
    fullName: '',
    year: '',
    state: '',
    branch: ''
  });

  const handleAddMember = () => {
    setEditingMember({ fullName: '', year: '', state: '', branch: '' });
    setEditingIndex(-1); // -1 indicates adding new member
    setIsOpen(true);
  };

  const handleEditMember = (index: number) => {
    setEditingMember({ ...members[index] });
    setEditingIndex(index);
    setIsOpen(true);
  };

  const handleSaveMember = () => {
    if (!editingMember.fullName.trim() || !editingMember.year.trim() || 
        !editingMember.state.trim() || !editingMember.branch.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const updatedMembers = [...members];
    
    if (editingIndex === -1) {
      // Adding new member
      updatedMembers.push(editingMember);
    } else {
      // Editing existing member
      updatedMembers[editingIndex] = editingMember;
    }
    
    onMembersChange(updatedMembers);
    setIsOpen(false);
    setEditingIndex(null);
  };

  const handleDeleteMember = (index: number) => {
    if (window.confirm('Are you sure you want to remove this dormitory member?')) {
      const updatedMembers = members.filter((_, i) => i !== index);
      onMembersChange(updatedMembers);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setEditingIndex(null);
    setEditingMember({ fullName: '', year: '', state: '', branch: '' });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Dormitory Members</h3>
          <p className="text-sm text-gray-500">
            Manage current residents of {propertyTitle}
          </p>
        </div>
        <button
          onClick={handleAddMember}
          disabled={disabled}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add Member
        </button>
      </div>

      {/* Members List */}
      {members.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-gray-400 text-4xl mb-2">🏠</div>
          <p className="text-gray-500 mb-3">No dormitory members added yet</p>
          <p className="text-sm text-gray-400">
            Add details of current residents to help potential tenants know who they'll be sharing with
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-medium text-sm">{member.fullName.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{member.fullName}</h4>
                    <p className="text-sm text-gray-500">{member.year}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditMember(index)}
                    disabled={disabled}
                    className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50 transition-colors"
                    title="Edit member"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteMember(index)}
                    disabled={disabled}
                    className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors"
                    title="Remove member"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📚 Branch:</span>
                  <span className="text-gray-700">{member.branch}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📍 State:</span>
                  <span className="text-gray-700">{member.state}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Member Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingIndex === -1 ? 'Add New Member' : 'Edit Member'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={editingMember.fullName}
                  onChange={(e) => setEditingMember({ ...editingMember, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year *
                </label>
                <select
                  value={editingMember.year}
                  onChange={(e) => setEditingMember({ ...editingMember, year: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Working Professional">Working Professional</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Home State *
                </label>
                <input
                  type="text"
                  value={editingMember.state}
                  onChange={(e) => setEditingMember({ ...editingMember, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Delhi, Punjab, Maharashtra"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch of Study *
                </label>
                <input
                  type="text"
                  value={editingMember.branch}
                  onChange={(e) => setEditingMember({ ...editingMember, branch: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Computer Science, Mechanical, ECE"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMember}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                {editingIndex === -1 ? 'Add Member' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DormitoryMembersManager;
