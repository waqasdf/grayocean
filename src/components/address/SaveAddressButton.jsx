import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SavedAddress } from "@/entities/SavedAddress";

export default function SaveAddressButton({ addressData }) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await SavedAddress.create({
        street_address: addressData.street_address,
        city: addressData.city,
        state: addressData.state,
        zip_code: addressData.zip_code,
        latitude: addressData.latitude,
        longitude: addressData.longitude,
        neighborhood_score: addressData.neighborhood_score,
        median_household_income: addressData.median_household_income,
        median_home_value: addressData.median_home_value,
        collection_name: collectionName || 'Uncategorized',
        notes: notes,
        is_favorite: false,
        full_data: addressData
      });
      
      setOpen(false);
      setCollectionName('');
      setNotes('');
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs">
          Save Address
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[hsl(0,0%,12%)] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Save Address</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Collection Name</label>
            <Input
              placeholder="e.g., Investment Prospects, Client Sites"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Notes (Optional)</label>
            <Textarea
              placeholder="Add any notes about this address..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-white/5 border-white/10 text-white h-24"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            {isSaving ? 'Saving...' : 'Save Address'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}