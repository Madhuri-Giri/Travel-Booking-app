import { useState } from 'react';
import './Setting.css';

const Setting = () => {
  const [locationTrackEnabled, setLocationTrackEnabled] = useState(true);

  const toggleLocationTrack = () => {
    setLocationTrackEnabled(prevState => !prevState);
  };

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  const closeLanguageDropdown = () => {
    setShowLanguageDropdown(false);
  };

  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
  };

  return (
    <>

    <div className="Settings">
      <div className="setting">
        <div className="s-tp">
          <div className="s-track">
            <div className="s-one">
              <h6>Location Track</h6>
              <p>Enable Or Disable Location Track</p>
            </div>
            <div className="s-two">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="flexSwitchCheckChecked"
                  checked={locationTrackEnabled}
                  onChange={toggleLocationTrack}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="s-location">
          <h5>Location</h5>
          <div className="s-track">
            <div className="s-one">
              <h6>Location Tracking(recommendation)</h6>
              <p>Enable this feature for recommendations</p>
            </div>
            <div className="s-two">
              <i className="ri-check-line"></i>
            </div>
          </div>

          <div className="s-track">
            <div className="s-one">
              <h6>Location Features</h6>
              <p>Hours, Day, Month, Years</p>
            </div>
          </div>

          <div className="s-track">
            <div className="s-one">
              <h6>Select Your Languages</h6>
              <div className="language">
                <button className="lng" onClick={toggleLanguageDropdown}>
                  {selectedLanguage} <i className="ri-arrow-down-s-line"></i>
                </button>
                {showLanguageDropdown && (
                  <div className="language-dropdown">
                    <button className="close-btn" onClick={closeLanguageDropdown}>✕</button>
                    <div onClick={() => selectLanguage('English')}>
                      <input type="radio" name="language" checked={selectedLanguage === 'English'} readOnly /> English
                    </div>
                    <div onClick={() => selectLanguage('Arabic')}>
                      <input type="radio" name="language" checked={selectedLanguage === 'Arabic'} readOnly /> Arabic
                    </div>
                    <div onClick={() => selectLanguage('Spanish')}>
                      <input type="radio" name="language" checked={selectedLanguage === 'Spanish'} readOnly /> Spanish
                    </div>
                    <div onClick={() => selectLanguage('French')}>
                      <input type="radio" name="language" checked={selectedLanguage === 'French'} readOnly /> French
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="s-track">
            <div className="s-one">
              <h6>Sync Your Changes</h6>
            </div>
            <div className="s-two">
              <i className="ri-check-line"></i>
            </div>
          </div>

          <h5>Video Quality for Downloads</h5>
          <div className="s-track">
            <div className="s-one">
              <h6>Standard(recommendation)</h6>
              <p>Downloads faster and uses less storage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    </>
  );
};

export default Setting;
