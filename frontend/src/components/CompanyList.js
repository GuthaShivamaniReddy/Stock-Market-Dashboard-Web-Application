import React from 'react';
import { TrendingUp, Building2 } from 'lucide-react';

const CompanyList = ({ companies, selectedCompany, onCompanySelect, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full">
        <div className="flex items-center justify-center h-full">
          <div className="loading-spinner"></div>
          <span className="ml-2 text-gray-600">Loading companies...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full">
      <div className="flex items-center mb-4">
        <Building2 className="w-5 h-5 text-primary-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Companies</h2>
      </div>
      
      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {companies.map((company) => (
          <div
            key={company.symbol}
            onClick={() => onCompanySelect(company)}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
              selectedCompany?.symbol === company.symbol
                ? 'bg-primary-50 border border-primary-200'
                : 'border border-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-900 text-sm">
                    {company.symbol}
                  </span>
                  {selectedCompany?.symbol === company.symbol && (
                    <TrendingUp className="w-4 h-4 text-primary-600 ml-2" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {company.name}
                </p>
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mt-1">
                  {company.sector}
                </span>
              </div>
              
              {company.current_price && (
                <div className="text-right">
                  <div className="font-semibold text-gray-900 text-sm">
                    ${company.current_price.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {company.last_updated && 
                      new Date(company.last_updated).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {companies.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No companies available</p>
        </div>
      )}
    </div>
  );
};

export default CompanyList;
