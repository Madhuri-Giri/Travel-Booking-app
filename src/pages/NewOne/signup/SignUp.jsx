import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import Lottie from 'lottie-react';
import LottieImg from '../../../assets/images/languageanimation.json';
import "./SignUp.css";

const SignUp = () => {
    const navigate = useNavigate();

    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        otp: '',
        code: '',
        agreeTerms: false
    });
    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://app.sajpe.in/api/v1/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Registration successful:', data);
                navigate('/login');
            } else {
                console.log('Registration failed:', data);
            }
        } catch (error) {
            console.error('Error:', error);
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
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    return (
        <div className="Joinnow">
            <div className="Join">
                <div className="JoinLeft">
                    <Lottie animationData={LottieImg} style={{ height: '70%', width: '100%' }} />
                    <div className="language">
                        <button className="lng" onClick={toggleLanguageDropdown}>
                            {selectedLanguage} <i className="ri-arrow-down-s-line"></i>
                        </button>
                        {showLanguageDropdown && (
                            <div className="language-dropdown">
                                <button className="close-btn" onClick={closeLanguageDropdown}>✕</button>
                                {['English', 'Arabic', 'Spanish', 'French'].map(language => (
                                    <div key={language} onClick={() => selectLanguage(language)}>
                                        <input type="radio" name="language" checked={selectedLanguage === language} readOnly /> {language}
                                    </div>
                                ))}
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
                            {['name', 'mobile', 'email', 'code'].map(field => (
                                <div className="one" key={field}>
                                    <label>{`Enter Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}</label>
                                    <div className="int">
                                        <input
                                            type={field === 'email' ? 'email' : 'text'}
                                            name={field}
                                            placeholder={`Enter Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                                            value={formData[field]}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="one">
                                <label>Enter Your OTP</label>
                                <div className="int password-container">
                                    <input
                                        type={passwordShown ? 'text' : 'password'}
                                        name="otp"
                                        placeholder="Enter Your OTP"
                                        value={formData.otp}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                                        {passwordShown ? <RiEyeFill /> : <RiEyeOffFill />}
                                    </span>
                                </div>
                            </div>
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
    );
};

export default SignUp;
