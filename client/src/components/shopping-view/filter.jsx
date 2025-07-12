import React, { useState } from 'react';
import { filterOptions } from '../../config';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { SlidersHorizontal, X } from 'lucide-react';

const ProductFilter = ({ filters, handleFilter, handleClearAll }) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden sticky top-0 z-30 bg-white p-3 border-b">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setShowMobileFilter(true)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Mobile Drawer */}
      {showMobileFilter && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMobileFilter(false)}
          ></div>

          {/* Drawer */}
          <div className="fixed inset-0 bg-white z-50 flex flex-col animate-slide-in">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b shadow-sm">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button onClick={() => setShowMobileFilter(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Filter Body */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex justify-end mb-4">
                <Button
                  variant="ghost"
                  className="text-sm text-blue-600"
                  onClick={() => {
                    handleClearAll();
                    setShowMobileFilter(false);
                  }}
                >
                  Clear All
                </Button>
              </div>

              {Object.entries(filterOptions).map(([group, options]) => (
                <div key={group} className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 capitalize mb-3">
                    {group}
                  </h3>
                  <div className="space-y-3">
                    {options.map((opt) => (
                      <Label
                        key={opt.id}
                        htmlFor={`filter-${group}-${opt.id}`}
                        className="flex items-center gap-3 text-gray-700"
                      >
                        <Checkbox
                          id={`filter-${group}-${opt.id}`}
                          checked={filters?.[group]?.includes(opt.id) || false}
                          onCheckedChange={() => handleFilter(group, opt.id)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{opt.label}</span>
                      </Label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <Button
                className="w-full"
                onClick={() => setShowMobileFilter(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block bg-white rounded-lg shadow border p-6 w-full max-w-xs sticky top-4 h-fit">
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
          <Button
            variant="ghost"
            className="text-sm text-blue-600"
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        </div>

        <div className="space-y-8">
          {Object.entries(filterOptions).map(([group, options]) => (
            <section key={group}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 capitalize">
                {group}
              </h3>
              <div className="flex flex-col space-y-3">
                {options.map((opt) => (
                  <Label
                    key={opt.id}
                    htmlFor={`filter-${group}-${opt.id}`}
                    className="inline-flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                  >
                    <Checkbox
                      id={`filter-${group}-${opt.id}`}
                      className="h-4 w-4"
                      checked={filters?.[group]?.includes(opt.id) || false}
                      onCheckedChange={() => handleFilter(group, opt.id)}
                    />
                    <span className="text-sm">{opt.label}</span>
                  </Label>
                ))}
              </div>
            </section>
          ))}
        </div>
      </aside>
    </>
  );
};

export default ProductFilter;
