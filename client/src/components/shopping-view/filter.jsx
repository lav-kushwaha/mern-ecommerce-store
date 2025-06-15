import React from 'react';
import { filterOptions } from '../../config';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

const ProductFilter = () => (
  <aside className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 w-full max-w-xs">
    {/* Title */}
    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Filters</h2>

    {/* Filter Groups */}
    <div className="space-y-8">
      {Object.entries(filterOptions).map(([group, options]) => (
        <section key={group}>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">{group}</h3>
          <div className="flex flex-col space-y-3">
            {options.map((opt) => (
              <Label
                key={opt.id}
                htmlFor={`filter-${group}-${opt.id}`}
                className="inline-flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <Checkbox id={`filter-${group}-${opt.id}`} className="h-4 w-4" />
                <span className="text-sm">{opt.label}</span>
              </Label>
            ))}
          </div>
        </section>
      ))}
    </div>
  </aside>
);

export default ProductFilter;
