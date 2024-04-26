import { currencyFormatter } from '../Finance-Context/utils.js';
import ViewPreferenceModal from '../Modals/ViewPreferenceModal.js';
import { useState } from 'react';

function PreferenceCategoryItem({ preference }) {
  const [showViewPreferenceModal, setViewPreferenceModal] = useState(false);

  return (
    <div className="w-full p-2">
      <ViewPreferenceModal
        show={showViewPreferenceModal}
        onClose={setViewPreferenceModal}
        preference={preference}
      />
      <button
        onClick={() => {
          setViewPreferenceModal(true);
        }}
        className="w-full"
      >
        <div className="flex items-center justify-between px-4 py-4 bg-slate-400 rounded-lg">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6"
              style={{ backgroundColor: preference.color }}
            />
            <h4 className="capitalize">{preference.title}</h4>
          </div>
          <p>{currencyFormatter(preference.amount)}</p>
        </div>
      </button>
    </div>
  );
}

export default PreferenceCategoryItem;
