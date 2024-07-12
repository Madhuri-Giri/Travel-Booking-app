import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import Lottie from 'lottie-react';
import LottieImg from '../../assets/images/languageanimation.json';
import { setProfileData } from '../../redux-toolkit/slices/profileSlice';
import "./SignUp.css"

const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        password: '',
        toggle_status: false,
        agreeTerms: false
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.mobile.length !== 10) {
            setError('Mobile number must be exactly 10 digits.');
            return;
        }

        try {
            const response = await fetch('https://srninfotech.com/projects/travel-app/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    mobile: formData.mobile,
                    email: formData.email,
                    password: formData.password,
                    toggle_status: formData.toggle_status,
                    agreeTerms: formData.agreeTerms
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Registration successful!');
                setFormData({
                    name: '',
                    mobile: '',
                    email: '',
                    password: '',
                    toggle_status: false,
                    agreeTerms: false
                });

                // Dispatch action to store profile data in Redux
                dispatch(setProfileData({
                    name: formData.name,
                    email: formData.email,
                    mobile: formData.mobile
                }));

                // navigate('/profile');
            } else {
                setError(data.message || 'An error occurred.');
                console.log('Error response data:', data);
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
            console.log('Fetch error:', error);
        }
    };

    const loginHandler = () => {
        navigate('/login');
    };

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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    return (
        <div>
            <div className="Joinnow">
                <div className="Join">
                    <div className="JoinLeft">
                        <Lottie
                            animationData={LottieImg}
                            style={{ height: '70%', width: '100%' }}
                        />
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
                    <div className="JoinRight">
                        <div className="Top">
                            <h3>Register Your Account<span>!</span></h3>
                        </div>
                        <div className="Medium">
                            <form onSubmit={submitHandler}>
                                <div className="one">
                                    <label>Enter Your Name</label>
                                    <div className="int">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Enter Your Name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="one">
                                    <label>Enter Your Mobile No</label>
                                    <div className="int">
                                        <input
                                            type="number"
                                            name="mobile"
                                            placeholder="Enter Your Mobile No"
                                            value={formData.mobile}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="one">
                                    <label>Enter Your Email</label>
                                    <div className="int">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Enter Your Email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="one">
                                    <label>Enter Your Password</label>
                                    <div className="int password-container">
                                        <input
                                            type={passwordShown ? 'text' : 'password'}
                                            name="password"
                                            placeholder="Enter Your Password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                                            {passwordShown ? <RiEyeFill /> : <RiEyeOffFill />}
                                        </span>
                                    </div>
                                </div>
                                {error && <p className="error">{error}</p>}
                                {success && <p className="success">{success}</p>}
                                <p>
                                    <input
                                        type="checkbox"
                                        name="agreeTerms"
                                        checked={formData.agreeTerms}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    I agree to the Terms Of Services and Privacy Policy
                                </p>
                                <div className="one">
                                    <button type="submit">Register</button>
                                </div>
                                <div className="line">
                                    <p>Already a member?</p>
                                </div>
                                <div className="one">
                                    <button type="button" onClick={loginHandler}>Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
