import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  UserPlus,
} from 'lucide-react';

export const LoginView = ({ onLoginSuccess }) => {
  const { login, register, loginWithGoogle } = useAuth();

  // ============================================================
  // AUTH MODES
  // ============================================================

  const [mode, setMode] = useState('login');

  /*
    login
    register
    otp
    forgot
    reset
  */

  const isRegistering = mode === 'register';

  // ============================================================
  // LOGIN / REGISTER STATE
  // ============================================================

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ============================================================
  // OTP STATE
  // ============================================================

  const [verificationEmail, setVerificationEmail] =
    useState('');

  const [otp, setOtp] = useState([
    '',
    '',
    '',
    '',
    '',
  ]);

  const otpRefs = useRef([]);

  const [resendCooldown, setResendCooldown] =
    useState(0);

  // ============================================================
  // PASSWORD RESET STATE
  // ============================================================

  const [resetEmail, setResetEmail] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [newConfirmPassword, setNewConfirmPassword] =
    useState('');

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showNewConfirmPassword, setShowNewConfirmPassword] =
    useState(false);

  // ============================================================
  // PASSWORD VISIBILITY
  // ============================================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // ============================================================
  // UI STATE
  // ============================================================

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [successMessage, setSuccessMessage] =
    useState(null);

  const canvasRef = useRef(null);

  // ============================================================
  // SUPABASE PASSWORD RECOVERY LISTENER
  // ============================================================

  useEffect(() => {
    const {
      data: { subscription },
    } = authService.onAuthStateChange(
      (event) => {
        /*
         * Supabase fires PASSWORD_RECOVERY
         * when the user opens the password-reset
         * link.
         */
        if (event === 'PASSWORD_RECOVERY') {
          setMode('reset');
          setError(null);
          setSuccessMessage(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ============================================================
  // RESEND OTP TIMER
  // ============================================================

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendCooldown((current) =>
        current > 0 ? current - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // ============================================================
  // VALIDATION
  // ============================================================

  const isValidEmail = (value) => {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    return emailRegex.test(
      value.trim()
    );
  };

  const calculateAge = (dobString) => {
    const today = new Date();

    const dob = new Date(
      `${dobString}T00:00:00`
    );

    let age =
      today.getFullYear() -
      dob.getFullYear();

    const monthDifference =
      today.getMonth() -
      dob.getMonth();

    if (
      monthDifference < 0 ||
      (
        monthDifference === 0 &&
        today.getDate() < dob.getDate()
      )
    ) {
      age--;
    }

    return age;
  };

  const getMaxDob = () => {
    const today = new Date();

    /*
     * User must be OLDER than 10.
     */

    const maxDob = new Date(
      today.getFullYear() - 10,
      today.getMonth(),
      today.getDate() - 1
    );

    return maxDob
      .toISOString()
      .split('T')[0];
  };

  const validatePassword = (value) => {
    if (value.length < 8) {
      return 'Password must contain at least 8 characters.';
    }

    if (!/[A-Za-z]/.test(value)) {
      return 'Password must contain at least one letter.';
    }

    if (!/[0-9]/.test(value)) {
      return 'Password must contain at least one number.';
    }

    return null;
  };

  // ============================================================
  // RESET FORM
  // ============================================================

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  // ============================================================
  // SWITCH MODE
  // ============================================================

  const switchMode = (nextMode) => {
    setMode(nextMode);

    clearMessages();

    setEmail('');
    setPassword('');
    setConfirmPassword('');

    setUsername('');
    setFullName('');
    setDateOfBirth('');

    setOtp([
      '',
      '',
      '',
      '',
      '',
    ]);

    setVerificationEmail('');

    setResetEmail('');

    setNewPassword('');
    setNewConfirmPassword('');

    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowNewPassword(false);
    setShowNewConfirmPassword(false);
  };

  // ============================================================
  // LOGIN
  // ============================================================

  const handleSignIn = async (event) => {
    event.preventDefault();

    clearMessages();

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError(
        'Please enter your email and password.'
      );
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError(
        'Please enter a valid email address.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await login(
        normalizedEmail,
        password
      );

      onLoginSuccess();
    } catch (err) {
      console.error(
        'Login failed:',
        err
      );

      const msg = err?.message || err?.detail || '';
      const lower = msg.toLowerCase();
      if (lower.includes('created with google') || lower.includes('google')) {
        setError(
          'This account was created with Google. Please continue with Google to sign in.'
        );
      } else if (lower.includes('failed to fetch') || lower.includes('network error') || lower.includes('connection')) {
        setError(
          'Unable to connect to AxioGo backend server. Please verify the backend is running.'
        );
      } else {
        setError(
          msg || 'Invalid email or password.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // GOOGLE
  // ============================================================

  const handleGoogleLogin = async () => {
    clearMessages();

    try {
      setIsSubmitting(true);

      const res = await loginWithGoogle();
      if (res?.session) {
        onLoginSuccess();
      }

    } catch (err) {
      console.error(
        'Google OAuth failed:',
        err
      );

      setError(
        err?.message ||
        'Unable to continue with Google.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // CREATE ACCOUNT
  // ============================================================

  const handleRegister = async (event) => {
    event.preventDefault();

    clearMessages();

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    if (
      !normalizedUsername ||
      !fullName.trim() ||
      !normalizedEmail ||
      !dateOfBirth ||
      !password ||
      !confirmPassword
    ) {
      setError('Please complete all required fields.');
      return;
    }

    if (normalizedUsername.length < 3) {
      setError('Username must contain at least 3 characters.');
      return;
    }

    if (!/^[a-z0-9._-]+$/.test(normalizedUsername)) {
      setError(
        'Username can only contain letters, numbers, dots, underscores, and hyphens.'
      );
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const dob = new Date(`${dateOfBirth}T00:00:00`);

    if (Number.isNaN(dob.getTime())) {
      setError('Please enter a valid date of birth.');
      return;
    }

    if (dob > new Date()) {
      setError('Date of birth cannot be in the future.');
      return;
    }

    const age = calculateAge(dateOfBirth);

    if (age <= 10) {
      setError(
        'You must be older than 10 years to create an AxioGo account.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await register({
        email: normalizedEmail,
        password,
        username: normalizedUsername,
        fullName: fullName.trim(),
        dateOfBirth,
      });

      if (data?.session) {
        setSuccessMessage('Account created successfully.');
        setTimeout(() => onLoginSuccess(), 500);
        return;
      }

      // Supabase email confirmation is handled through the OTP screen.
      setVerificationEmail(normalizedEmail);
      setOtp(['', '', '', '', '', '']);
      setPassword('');
      setConfirmPassword('');
      setMode('otp');
      setResendCooldown(60);
      setSuccessMessage(
        'Account created successfully. Enter the verification code sent to your email.'
      );

      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      console.error('Registration failed:', err);

      const message = String(err?.message || err?.detail || '');
      const lowerMessage = message.toLowerCase();
      const status = Number(err?.status ?? err?.statusCode ?? 0);

      if (
        lowerMessage.includes('created with google') ||
        lowerMessage.includes('continue with google')
      ) {
        setError(
          'This account was created with Google. Please continue with Google to sign in.'
        );
        return;
      }

      if (
        status === 409 ||
        lowerMessage.includes('already registered') ||
        lowerMessage.includes('already exists') ||
        lowerMessage.includes('user already registered') ||
        lowerMessage.includes('email already exists') ||
        lowerMessage.includes('email_exists')
      ) {
        setError(
          'An account with this email already exists. Please sign in instead.'
        );
        return;
      }

      if (
        status === 429 ||
        lowerMessage.includes('rate limit') ||
        lowerMessage.includes('too many requests')
      ) {
        setError(
          'Too many verification requests. Please wait a moment and try again.'
        );
        return;
      }

      if (
        status >= 500 && status <= 505 ||
        lowerMessage.includes('http 500') ||
        lowerMessage.includes('http 502') ||
        lowerMessage.includes('http 503') ||
        lowerMessage.includes('http 504') ||
        lowerMessage.includes('http 505')
      ) {
        setError(
          'AxioGo could not complete account creation right now. Please try again shortly.'
        );
        return;
      }

      if (
        lowerMessage.includes('failed to fetch') ||
        lowerMessage.includes('fetch failed') ||
        lowerMessage.includes('network error') ||
        lowerMessage.includes('network request failed')
      ) {
        setError(
          'Unable to connect to AxioGo authentication services. Please check your connection and try again.'
        );
        return;
      }

      setError(message || 'Unable to create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // OTP INPUT
  // ============================================================

  const handleOtpChange = (
    index,
    value
  ) => {
    /*
     * Only allow digits.
     */
    const digit =
      value.replace(/\D/g, '').slice(-1);

    const updatedOtp = [...otp];

    updatedOtp[index] = digit;

    setOtp(updatedOtp);

    /*
     * Automatically move to next box.
     */
    if (
      digit &&
      index < otpRefs.current.length - 1
    ) {
      otpRefs.current[
        index + 1
      ]?.focus();
    }

    /*
     * Automatically verify when
     * all 6 digits are entered.
     */
    if (
      digit &&
      index === 5 &&
      updatedOtp.every(Boolean)
    ) {
      setTimeout(() => {
        handleVerifyOtp(updatedOtp.join(''));
      }, 100);
    }
  };

  const handleOtpKeyDown = (
    index,
    event
  ) => {
    /*
     * Backspace on empty box moves
     * to previous box.
     */
    if (
      event.key === 'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      otpRefs.current[
        index - 1
      ]?.focus();
    }

    /*
     * Left arrow
     */
    if (
      event.key === 'ArrowLeft' &&
      index > 0
    ) {
      otpRefs.current[
        index - 1
      ]?.focus();
    }

    /*
     * Right arrow
     */
    if (
      event.key === 'ArrowRight' &&
      index < 5
    ) {
      otpRefs.current[
        index + 1
      ]?.focus();
    }
  };

  // ============================================================
  // OTP PASTE
  // ============================================================

  const handleOtpPaste = (event) => {
    event.preventDefault();

    const pasted =
      event.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, 6);

    if (!pasted) {
      return;
    }

    const updatedOtp = [
      '',
      '',
      '',
      '',
      '',
      '',
    ];

    pasted
      .split('')
      .forEach((digit, index) => {
        updatedOtp[index] = digit;
      });

    setOtp(updatedOtp);

    const focusIndex =
      Math.min(
        pasted.length,
        5
      );

    otpRefs.current[
      focusIndex
    ]?.focus();

    if (pasted.length === 6) {
      setTimeout(() => {
        handleVerifyOtp(pasted);
      }, 100);
    }
  };

  // ============================================================
  // VERIFY OTP
  // ============================================================

  const handleVerifyOtp = async (
    suppliedOtp = null
  ) => {
    clearMessages();

    const code =
      suppliedOtp ||
      otp.join('');

    if (code.length !== 6) {
      setError(
        'Please enter the 6-digit verification code.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const data =
        await authService.verifySignupOtp(
          verificationEmail,
          code
        );

      if (data?.session) {
        setSuccessMessage(
          'Email verified successfully. Welcome to AxioGo.'
        );

        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      } else {
        setSuccessMessage(
          'Email verified successfully. You can now sign in.'
        );

        setMode('login');

        setEmail(
          verificationEmail
        );
      }
    } catch (err) {
      console.error(
        'OTP verification failed:',
        err
      );

      setError(
        'Invalid or expired verification code. Please try again.'
      );

      setOtp([
        '',
        '',
        '',
        '',
        '',
      ]);

      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 50);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // RESEND OTP
  // ============================================================

  const handleResendOtp = async () => {
    if (resendCooldown > 0) {
      return;
    }

    clearMessages();

    try {
      setIsSubmitting(true);

      await authService.resendSignupOtp(
        verificationEmail
      );

      setOtp([
        '',
        '',
        '',
        '',
        '',
      ]);

      setResendCooldown(60);

      setSuccessMessage(
        'A new verification code has been sent to your email.'
      );

      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);

    } catch (err) {
      console.error(
        'Resend OTP failed:',
        err
      );

      setError(
        err?.message ||
        'Unable to resend the verification code.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // FORGOT PASSWORD
  // ============================================================

  const handleForgotPassword = async (
    event
  ) => {
    event.preventDefault();

    clearMessages();

    const normalizedEmail =
      resetEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      setError(
        'Please enter your email address.'
      );
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError(
        'Please enter a valid email address.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.sendPasswordReset(
        normalizedEmail
      );

      setSuccessMessage(
        'Password reset instructions have been sent to your email.'
      );

    } catch (err) {
      console.error(
        'Password reset failed:',
        err
      );

      setError(
        err?.message ||
        'Unable to send the password reset email.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // UPDATE PASSWORD
  // ============================================================

  const handleUpdatePassword = async (
    event
  ) => {
    event.preventDefault();

    clearMessages();

    const passwordError =
      validatePassword(
        newPassword
      );

    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (
      newPassword !==
      newConfirmPassword
    ) {
      setError(
        'Passwords do not match.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.updatePassword(
        newPassword
      );

      setNewPassword('');
      setNewConfirmPassword('');

      setSuccessMessage(
        'Password updated successfully. You can now sign in.'
      );

      setTimeout(() => {
        switchMode('login');
      }, 1000);

    } catch (err) {
      console.error(
        'Password update failed:',
        err
      );

      setError(
        err?.message ||
        'Unable to update your password.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // PARTICLE BACKGROUND
  // ============================================================

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext('2d');

    if (!ctx) return;

    const parent =
      canvas.parentElement;

    if (!parent) return;

    let animationFrameId;

    const resize = () => {
      canvas.width =
        parent.clientWidth ||
        window.innerWidth;

      canvas.height =
        parent.clientHeight ||
        window.innerHeight;
    };

    resize();

    window.addEventListener(
      'resize',
      resize
    );

    const particleCount =
      canvas.width < 768
        ? 85
        : 170;

    const particles = [];

    const colors = [
      '#FF3046',
      '#FF3046',
      '#FF3046',
      '#AEB8C4',
      '#AEB8C4',
      '#20D6D2',
    ];

    for (
      let i = 0;
      i < particleCount;
      i++
    ) {
      const depth =
        Math.random() * 0.8 + 0.2;

      particles.push({
        x:
          Math.random() *
          canvas.width,

        y:
          Math.random() *
          canvas.height,

        vx:
          (Math.random() - 0.5) *
          0.45,

        vy:
          (Math.random() - 0.5) *
          0.45,

        size:
          (Math.random() * 1.8 + 0.8) *
          (0.7 + depth * 0.65),

        alpha:
          Math.random() * 0.32 + 0.08,

        depth,

        speed:
          0.55 +
          Math.random() * 0.75,

        phase:
          Math.random() *
          Math.PI *
          2,

        color:
          colors[
          Math.floor(
            Math.random() *
            colors.length
          )
          ],
      });
    }

    let mouseX =
      canvas.width * 0.72;

    let mouseY =
      canvas.height * 0.5;

    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    let mouseActive = false;

    const ATTRACTION_RADIUS = 260;
    const REPULSION_RADIUS = 70;
    const ATTRACTION_STRENGTH = 0.045;
    const REPULSION_STRENGTH = 0.16;
    const MAX_SPEED = 3.2;

    const handleMouseMove = (
      event
    ) => {
      const rect =
        parent.getBoundingClientRect();

      targetMouseX =
        event.clientX -
        rect.left;

      targetMouseY =
        event.clientY -
        rect.top;

      mouseActive = true;
    };

    const handleMouseLeave = () => {
      mouseActive = false;
    };

    parent.addEventListener(
      'mousemove',
      handleMouseMove
    );

    parent.addEventListener(
      'mouseleave',
      handleMouseLeave
    );

    let time = 0;

    const draw = () => {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const gridSize = 48;

      ctx.strokeStyle =
        'rgba(255,255,255,0.018)';

      ctx.lineWidth = 1;

      for (
        let x = 0;
        x < canvas.width;
        x += gridSize
      ) {
        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(
          x,
          canvas.height
        );

        ctx.stroke();
      }

      for (
        let y = 0;
        y < canvas.height;
        y += gridSize
      ) {
        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(
          canvas.width,
          y
        );

        ctx.stroke();
      }

      targetMouseX =
        Math.max(
          0,
          Math.min(
            canvas.width,
            targetMouseX
          )
        );

      targetMouseY =
        Math.max(
          0,
          Math.min(
            canvas.height,
            targetMouseY
          )
        );

      mouseX +=
        (targetMouseX - mouseX) *
        0.11;

      mouseY +=
        (targetMouseY - mouseY) *
        0.11;

      if (mouseActive) {
        const pointerGlow =
          ctx.createRadialGradient(
            mouseX,
            mouseY,
            0,
            mouseX,
            mouseY,
            230
          );

        pointerGlow.addColorStop(
          0,
          'rgba(32,214,210,0.055)'
        );

        pointerGlow.addColorStop(
          0.25,
          'rgba(32,214,210,0.025)'
        );

        pointerGlow.addColorStop(
          0.6,
          'rgba(32,214,210,0.008)'
        );

        pointerGlow.addColorStop(
          1,
          'rgba(32,214,210,0)'
        );

        ctx.beginPath();

        ctx.arc(
          mouseX,
          mouseY,
          230,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          pointerGlow;

        ctx.fill();
      }

      for (
        let i = 0;
        i < particles.length;
        i++
      ) {
        const p = particles[i];

        p.vx +=
          Math.sin(
            time * 0.45 +
            p.phase
          ) * 0.018;

        p.vy +=
          Math.cos(
            time * 0.35 +
            p.phase
          ) * 0.018;

        if (mouseActive) {
          const dx =
            mouseX - p.x;

          const dy =
            mouseY - p.y;

          const distance =
            Math.sqrt(
              dx * dx +
              dy * dy
            );

          if (
            distance <
            ATTRACTION_RADIUS &&
            distance > 0
          ) {
            const nx =
              dx / distance;

            const ny =
              dy / distance;

            const attraction =
              Math.pow(
                1 -
                distance /
                ATTRACTION_RADIUS,
                1.7
              ) *
              ATTRACTION_STRENGTH *
              p.depth;

            p.vx +=
              nx * attraction;

            p.vy +=
              ny * attraction;
          }

          if (
            distance <
            REPULSION_RADIUS &&
            distance > 0
          ) {
            const nx =
              dx / distance;

            const ny =
              dy / distance;

            const repulsion =
              Math.pow(
                1 -
                distance /
                REPULSION_RADIUS,
                2
              ) *
              REPULSION_STRENGTH;

            p.vx -=
              nx * repulsion;

            p.vy -=
              ny * repulsion;
          }
        }

        p.vx *= 0.982;
        p.vy *= 0.982;

        const speed =
          Math.sqrt(
            p.vx * p.vx +
            p.vy * p.vy
          );

        if (speed > MAX_SPEED) {
          p.vx =
            (p.vx / speed) *
            MAX_SPEED;

          p.vy =
            (p.vy / speed) *
            MAX_SPEED;
        }

        p.x +=
          p.vx * p.speed;

        p.y +=
          p.vy * p.speed;

        if (p.x < -30)
          p.x =
            canvas.width + 30;

        if (
          p.x >
          canvas.width + 30
        )
          p.x = -30;

        if (p.y < -30)
          p.y =
            canvas.height + 30;

        if (
          p.y >
          canvas.height + 30
        )
          p.y = -30;

        ctx.beginPath();

        ctx.arc(
          p.x,
          p.y,
          p.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          p.color;

        ctx.globalAlpha =
          p.alpha;

        ctx.fill();

        for (
          let j = i + 1;
          j < particles.length;
          j++
        ) {
          const p2 =
            particles[j];

          const dx =
            p.x - p2.x;

          const dy =
            p.y - p2.y;

          const distance =
            Math.sqrt(
              dx * dx +
              dy * dy
            );

          if (distance < 85) {
            ctx.beginPath();

            ctx.moveTo(
              p.x,
              p.y
            );

            ctx.lineTo(
              p2.x,
              p2.y
            );

            ctx.strokeStyle =
              'rgba(255,48,70,0.055)';

            ctx.lineWidth = 0.5;

            ctx.globalAlpha =
              (1 - distance / 85) *
              0.35;

            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;

      time += 0.016;

      animationFrameId =
        requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(
        animationFrameId
      );

      window.removeEventListener(
        'resize',
        resize
      );

      parent.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      parent.removeEventListener(
        'mouseleave',
        handleMouseLeave
      );
    };
  }, []);

  // ============================================================
  // INPUT STYLES
  // ============================================================

  const loginInputClass = `
    w-full
    bg-transparent
    border-0
    border-b
    border-white/[0.10]
    rounded-none
    px-3
    py-3
    pr-10
    text-sm
    text-white
    font-mono
    placeholder:text-white/25
    focus:outline-none
    focus:border-axio-red
    transition-all
    duration-300
  `;

  const registerInputClass = `
    w-full
    bg-white/[0.025]
    border
    border-white/[0.08]
    rounded-lg
    px-4
    py-3
    text-sm
    text-white
    font-mono
    placeholder:text-white/25
    focus:outline-none
    focus:border-axio-red
    focus:bg-white/[0.035]
    transition-all
    duration-300
  `;

  // ============================================================
  // HEADER TEXT
  // ============================================================

  const getHeaderLabel = () => {
    if (mode === 'register') {
      return 'CREATE AXIOGO ACCOUNT';
    }

    if (mode === 'otp') {
      return 'EMAIL VERIFICATION';
    }

    if (mode === 'forgot') {
      return 'PASSWORD RECOVERY';
    }

    if (mode === 'reset') {
      return 'SECURE PASSWORD RESET';
    }

    return 'SECURE ACCESS';
  };

  const getHeaderTitle = () => {
    if (mode === 'register') {
      return 'Create your account.';
    }

    if (mode === 'otp') {
      return 'Verify your email.';
    }

    if (mode === 'forgot') {
      return 'Forgot your password?';
    }

    if (mode === 'reset') {
      return 'Create a new password.';
    }

    return 'Welcome back.';
  };

  const getHeaderDescription = () => {
    if (mode === 'register') {
      return 'Create your account to access the AxioGo intelligence workspace.';
    }

    if (mode === 'otp') {
      return `Enter the 6-digit code sent to ${verificationEmail}.`;
    }

    if (mode === 'forgot') {
      return 'Enter your email and we will send you a secure password reset link.';
    }

    if (mode === 'reset') {
      return 'Choose a new secure password for your AxioGo account.';
    }

    return 'Sign in to continue to your AxioGo intelligence workspace.';
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="
        relative
        h-screen
        w-full
        overflow-hidden
        bg-axio-bg
        text-white
      "
    >
      {/* PARTICLES */}

      <canvas
        ref={canvasRef}
        className="
          absolute
          inset-0
          z-0
          pointer-events-none
        "
      />

      {/* VIGNETTE */}

      <div
        className="
          absolute
          inset-0
          z-0
          pointer-events-none
          bg-[radial-gradient(circle_at_68%_50%,transparent_10%,rgba(5,7,10,0.45)_55%,rgba(5,7,10,0.92)_100%)]
        "
      />

      {/* RED GLOW */}

      <div
        className="
          absolute
          left-[24%]
          top-1/2
          -translate-y-1/2
          w-[500px]
          h-[500px]
          rounded-full
          bg-axio-red/[0.035]
          blur-[150px]
          pointer-events-none
        "
      />

      {/* MAIN */}

      <div
        className="
          relative
          z-10
          h-screen
          w-full
          grid
          grid-cols-1
          lg:grid-cols-[1.15fr_0.85fr]
          items-center
        "
      >
        {/* LEFT BRAND */}

        <section
          className="
            relative
            h-full
            flex
            items-center
            px-8
            md:px-14
            lg:px-20
            xl:px-28
          "
        >
          <div
            className="
              max-w-3xl
              animate-[brandReveal_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]
              opacity-0
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                mb-6
              "
            >
              <span
                className="
                  w-8
                  h-px
                  bg-axio-red
                  shadow-[0_0_12px_rgba(255,48,70,0.5)]
                "
              />

              <span
                className="
                  text-[9px]
                  md:text-[10px]
                  uppercase
                  tracking-[0.35em]
                  text-axio-muted
                "
              >
                ENTERPRISE AI INTELLIGENCE
              </span>
            </div>

            <h1
              className="
                text-[18vw]
                sm:text-[15vw]
                lg:text-[9.5vw]
                xl:text-[9vw]
                leading-[0.78]
                font-black
                tracking-[-0.065em]
                whitespace-nowrap
                select-none
              "
            >
              <span className="text-white">
                AXIO
              </span>

              <span
                className="
                  text-axio-red
                  drop-shadow-[0_0_45px_rgba(255,48,70,0.12)]
                "
              >
                GO
              </span>
            </h1>

            <p
              className="
                mt-8
                max-w-xl
                text-sm
                md:text-base
                lg:text-lg
                leading-relaxed
                text-axio-text-sub
              "
            >
              Go beyond enterprise data with AI that
              understands your business context,
              uncovers meaningful insights, and turns
              them into intelligent action.
            </p>

            <div
              className="
                mt-8
                flex
                flex-wrap
                items-center
                gap-x-7
                gap-y-3
                text-[8px]
                md:text-[9px]
                uppercase
                tracking-[0.2em]
                text-axio-muted/50
              "
            >
              <div className="flex items-center gap-2">
                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-axio-red
                  "
                />
                TRUSTED DATA
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-axio-red/70
                  "
                />
                BUSINESS CONTEXT
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-axio-red/50
                  "
                />
                INTELLIGENT ACTION
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT AUTH */}

        <section
          className="
            relative
            h-full
            flex
            items-center
            justify-center
            px-7
            md:px-12
            lg:px-12
            xl:px-20
          "
        >
          <div
            className="
              w-full
              max-w-[430px]
              max-h-[calc(100vh-40px)]
              animate-[loginReveal_1s_cubic-bezier(0.16,1,0.3,1)_0.15s_forwards]
              opacity-0
            "
          >
            {/* HEADER */}

            <div
              className={
                mode === 'register'
                  ? 'mb-4'
                  : 'mb-7'
              }
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-3
                "
              >
                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-axio-red
                    shadow-[0_0_10px_rgba(255,48,70,0.7)]
                    animate-pulse
                  "
                />

                <span
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.25em]
                    text-axio-muted
                  "
                >
                  {getHeaderLabel()}
                </span>
              </div>

              <h2
                className="
                  text-2xl
                  md:text-3xl
                  font-semibold
                  tracking-tight
                  text-white
                "
              >
                {getHeaderTitle()}
              </h2>

              <p
                className="
                  mt-1.5
                  text-[11px]
                  leading-relaxed
                  text-axio-muted
                "
              >
                {getHeaderDescription()}
              </p>
            </div>

            {/* SUCCESS */}

            {successMessage && (
              <div
                className="
                  mb-4
                  text-[10px]
                  leading-relaxed
                  text-emerald-300
                  bg-emerald-400/10
                  border
                  border-emerald-400/20
                  rounded-lg
                  px-4
                  py-3
                "
              >
                {successMessage}
              </div>
            )}

            {/* ERROR */}

            {error && (
              <div
                className="
                  mb-4
                  text-[10px]
                  leading-relaxed
                  text-axio-red
                  bg-axio-red/10
                  border
                  border-axio-red/20
                  rounded-lg
                  px-4
                  py-3
                "
              >
                {error}
              </div>
            )}

            {/* ======================================================
                LOGIN
            ====================================================== */}

            {mode === 'login' && (
              <>
                <form
                  onSubmit={handleSignIn}
                  autoComplete="off"
                  className="space-y-5"
                >
                  {/* EMAIL */}

                  <div className="group">
                    <label
                      className="
                        block
                        mb-1.5
                        text-[8px]
                        uppercase
                        tracking-[0.2em]
                        text-axio-muted
                      "
                    >
                      Email
                    </label>

                    <input
                      type="email"
                      name="login-email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      placeholder="you@email.com"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck="false"
                      required
                      disabled={isSubmitting}
                      className={
                        loginInputClass
                      }
                    />
                  </div>

                  {/* PASSWORD */}

                  <div className="group">
                    <label
                      className="
                        block
                        mb-1.5
                        text-[8px]
                        uppercase
                        tracking-[0.2em]
                        text-axio-muted
                      "
                    >
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        name="login-password"
                        value={password}
                        onChange={(e) =>
                          setPassword(
                            e.target.value
                          )
                        }
                        placeholder="Password"
                        autoComplete="new-password"
                        required
                        disabled={isSubmitting}
                        className={
                          loginInputClass
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (value) => !value
                          )
                        }
                        className="
                          absolute
                          right-2
                          bottom-2.5
                          text-axio-muted
                          hover:text-white
                        "
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* FORGOT PASSWORD */}

                  <div className="flex justify-end -mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(email);
                        switchMode('forgot');
                      }}
                      disabled={isSubmitting}
                      className="
                        text-[8px]
                        text-axio-muted
                        hover:text-axio-red
                        transition-colors
                      "
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* SIGN IN */}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                      group
                      relative
                      w-full
                      overflow-hidden
                      py-3
                      rounded-lg
                      bg-axio-red
                      hover:bg-red-600
                      disabled:opacity-60
                      text-white
                      font-bold
                      text-[9px]
                      uppercase
                      tracking-[0.2em]
                      flex
                      items-center
                      justify-center
                      gap-2
                      transition-all
                      duration-300
                    "
                  >
                    <span>
                      {isSubmitting
                        ? 'SIGNING IN…'
                        : 'SIGN IN TO AXIOGO'}
                    </span>

                    <ArrowRight
                      className="
                        w-4
                        h-4
                        group-hover:translate-x-1
                        transition-transform
                      "
                    />
                  </button>
                </form>
              </>
            )}

            {/* ======================================================
                CREATE ACCOUNT
            ====================================================== */}

            {mode === 'register' && (
              <form
                onSubmit={handleRegister}
                autoComplete="off"
                className="space-y-3"
              >
                {/* ROW 1 */}

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-x-5
                    gap-y-3
                  "
                >
                  <div>
                    <label
                      className="
                        block
                        mb-1.5
                        text-[8px]
                        uppercase
                        tracking-[0.2em]
                        text-axio-muted
                      "
                    >
                      Username
                    </label>

                    <input
                      type="text"
                      name="register-username"
                      value={username}
                      onChange={(e) =>
                        setUsername(
                          e.target.value
                        )
                      }
                      placeholder="username"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck="false"
                      required
                      disabled={isSubmitting}
                      className={
                        registerInputClass
                      }
                    />
                  </div>

                  <div>
                    <label
                      className="
                        block
                        mb-1.5
                        text-[8px]
                        uppercase
                        tracking-[0.2em]
                        text-axio-muted
                      "
                    >
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="register-full-name"
                      value={fullName}
                      onChange={(e) =>
                        setFullName(
                          e.target.value
                        )
                      }
                      placeholder="Full name"
                      autoComplete="off"
                      required
                      disabled={isSubmitting}
                      className={
                        registerInputClass
                      }
                    />
                  </div>
                </div>

                {/* ROW 2 */}

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-x-5
                    gap-y-3
                  "
                >
                  <div>
                    <label
                      className="
                        block
                        mb-1.5
                        text-[8px]
                        uppercase
                        tracking-[0.2em]
                        text-axio-muted
                      "
                    >
                      Email
                    </label>

                    <input
                      type="email"
                      name="register-email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      placeholder="you@email.com"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck="false"
                      required
                      disabled={isSubmitting}
                      className={
                        registerInputClass
                      }
                    />
                  </div>

                  <div>
                    <label
                      className="
                        block
                        mb-1.5
                        text-[8px]
                        uppercase
                        tracking-[0.2em]
                        text-axio-muted
                      "
                    >
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      name="register-dob"
                      value={dateOfBirth}
                      onChange={(e) =>
                        setDateOfBirth(
                          e.target.value
                        )
                      }
                      max={getMaxDob()}
                      required
                      disabled={isSubmitting}
                      className={`
                        ${registerInputClass}
                        [color-scheme:dark]
                        cursor-pointer
                      `}
                    />

                    <p className="
                      mt-1
                      text-[7px]
                      text-axio-muted/50
                    ">
                      Must be older than 10 years
                    </p>
                  </div>
                </div>

                {/* ROW 3 */}

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-x-5
                    gap-y-3
                  "
                >
                  {/* PASSWORD */}

                  <div>
                    <label
                      className="
                        block
                        mb-1.5
                        text-[8px]
                        uppercase
                        tracking-[0.2em]
                        text-axio-muted
                      "
                    >
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        name="register-password"
                        value={password}
                        onChange={(e) =>
                          setPassword(
                            e.target.value
                          )
                        }
                        placeholder="Min. 8 characters"
                        autoComplete="new-password"
                        required
                        disabled={isSubmitting}
                        className={`
                          ${registerInputClass}
                          pr-11
                        `}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (value) =>
                              !value
                          )
                        }
                        className="
                          absolute
                          right-3
                          top-1/2
                          -translate-y-1/2
                          text-axio-muted
                          hover:text-white
                        "
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM */}

                  <div>
                    <label
                      className="
                        block
                        mb-1.5
                        text-[8px]
                        uppercase
                        tracking-[0.2em]
                        text-axio-muted
                      "
                    >
                      Confirm Password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showConfirmPassword
                            ? 'text'
                            : 'password'
                        }
                        name="register-confirm-password"
                        value={
                          confirmPassword
                        }
                        onChange={(e) =>
                          setConfirmPassword(
                            e.target.value
                          )
                        }
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        required
                        disabled={isSubmitting}
                        className={`
                          ${registerInputClass}
                          pr-11
                        `}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (value) =>
                              !value
                          )
                        }
                        className="
                          absolute
                          right-3
                          top-1/2
                          -translate-y-1/2
                          text-axio-muted
                          hover:text-white
                        "
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {confirmPassword &&
                      password !==
                      confirmPassword && (
                        <p className="
                          mt-1
                          text-[7px]
                          text-axio-red
                        ">
                          Passwords do not match
                        </p>
                      )}
                  </div>
                </div>

                <div
                  className="
                    text-[7px]
                    text-axio-muted/45
                  "
                >
                  Password must contain at least
                  8 characters, one letter and one
                  number.
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    group
                    relative
                    w-full
                    overflow-hidden
                    mt-2
                    py-3
                    rounded-lg
                    bg-axio-red
                    hover:bg-red-600
                    disabled:opacity-60
                    text-white
                    font-bold
                    text-[9px]
                    uppercase
                    tracking-[0.2em]
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition-all
                    duration-300
                  "
                >
                  <UserPlus className="w-4 h-4" />

                  {isSubmitting
                    ? 'CREATING ACCOUNT…'
                    : 'CREATE ACCOUNT'}
                </button>
              </form>
            )}

            {/* ======================================================
                OTP
            ====================================================== */}

            {mode === 'otp' && (
              <div className="space-y-6">

                <div className="
                  text-center
                  text-[10px]
                  text-axio-muted
                  leading-relaxed
                ">
                  We sent a 6-digit verification
                  code to
                  <br />

                  <span className="
                    text-white
                    font-semibold
                  ">
                    {verificationEmail}
                  </span>
                </div>

                {/* OTP BOXES */}

                <div
                  className="
                    flex
                    justify-center
                    gap-2
                  "
                >
                  {otp.map(
                    (digit, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          otpRefs.current[
                            index
                          ] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(event) =>
                          handleOtpChange(
                            index,
                            event.target.value
                          )
                        }
                        onKeyDown={(event) =>
                          handleOtpKeyDown(
                            index,
                            event
                          )
                        }
                        onPaste={
                          index === 0
                            ? handleOtpPaste
                            : undefined
                        }
                        disabled={
                          isSubmitting
                        }
                        className="
                          w-11
                          h-13
                          md:w-12
                          md:h-14
                          text-center
                          text-lg
                          font-mono
                          font-semibold
                          text-white
                          bg-white/[0.025]
                          border
                          border-white/[0.10]
                          rounded-lg
                          focus:outline-none
                          focus:border-axio-red
                          focus:bg-white/[0.04]
                          transition-all
                        "
                      />
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleVerifyOtp()
                  }
                  disabled={
                    isSubmitting ||
                    otp.join('').length !== 6
                  }
                  className="
                    w-full
                    py-3
                    rounded-lg
                    bg-axio-red
                    hover:bg-red-600
                    disabled:opacity-50
                    text-white
                    font-bold
                    text-[9px]
                    uppercase
                    tracking-[0.2em]
                    transition-all
                  "
                >
                  {isSubmitting
                    ? 'VERIFYING…'
                    : 'VERIFY EMAIL'}
                </button>

                <div className="
                  flex
                  flex-col
                  items-center
                  gap-3
                ">
                  <button
                    type="button"
                    onClick={
                      handleResendOtp
                    }
                    disabled={
                      isSubmitting ||
                      resendCooldown > 0
                    }
                    className="
                      text-[9px]
                      text-axio-red
                      hover:text-red-400
                      disabled:text-axio-muted/40
                      transition-colors
                    "
                  >
                    {resendCooldown > 0
                      ? `Resend code in ${resendCooldown}s`
                      : 'Resend verification code'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      switchMode('login')
                    }
                    disabled={
                      isSubmitting
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      text-[9px]
                      text-axio-muted
                      hover:text-white
                    "
                  >
                    <ArrowLeft className="w-3 h-3" />

                    Back to sign in
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================
                FORGOT PASSWORD
            ====================================================== */}

            {mode === 'forgot' && (
              <form
                onSubmit={
                  handleForgotPassword
                }
                className="space-y-5"
              >
                <div>
                  <label
                    className="
                      block
                      mb-1.5
                      text-[8px]
                      uppercase
                      tracking-[0.2em]
                      text-axio-muted
                    "
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) =>
                      setResetEmail(
                        e.target.value
                      )
                    }
                    placeholder="you@email.com"
                    autoComplete="off"
                    autoCapitalize="none"
                    required
                    disabled={isSubmitting}
                    className={
                      registerInputClass
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    w-full
                    py-3
                    rounded-lg
                    bg-axio-red
                    hover:bg-red-600
                    disabled:opacity-60
                    text-white
                    font-bold
                    text-[9px]
                    uppercase
                    tracking-[0.2em]
                    transition-all
                  "
                >
                  {isSubmitting
                    ? 'SENDING…'
                    : 'SEND RESET LINK'}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    switchMode('login')
                  }
                  className="
                    mx-auto
                    flex
                    items-center
                    gap-2
                    text-[9px]
                    text-axio-muted
                    hover:text-white
                  "
                >
                  <ArrowLeft className="w-3 h-3" />

                  Back to sign in
                </button>
              </form>
            )}

            {/* ======================================================
                RESET PASSWORD
            ====================================================== */}

            {mode === 'reset' && (
              <form
                onSubmit={
                  handleUpdatePassword
                }
                className="space-y-5"
              >
                {/* NEW PASSWORD */}

                <div>
                  <label
                    className="
                      block
                      mb-1.5
                      text-[8px]
                      uppercase
                      tracking-[0.2em]
                      text-axio-muted
                    "
                  >
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showNewPassword
                          ? 'text'
                          : 'password'
                      }
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(
                          e.target.value
                        )
                      }
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                      required
                      disabled={isSubmitting}
                      className={`
                        ${registerInputClass}
                        pr-11
                      `}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(
                          (value) =>
                            !value
                        )
                      }
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-axio-muted
                        hover:text-white
                      "
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* CONFIRM */}

                <div>
                  <label
                    className="
                      block
                      mb-1.5
                      text-[8px]
                      uppercase
                      tracking-[0.2em]
                      text-axio-muted
                    "
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showNewConfirmPassword
                          ? 'text'
                          : 'password'
                      }
                      value={
                        newConfirmPassword
                      }
                      onChange={(e) =>
                        setNewConfirmPassword(
                          e.target.value
                        )
                      }
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      required
                      disabled={isSubmitting}
                      className={`
                        ${registerInputClass}
                        pr-11
                      `}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewConfirmPassword(
                          (value) =>
                            !value
                        )
                      }
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-axio-muted
                        hover:text-white
                      "
                    >
                      {showNewConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {newConfirmPassword &&
                    newPassword !==
                    newConfirmPassword && (
                      <p className="
                        mt-1
                        text-[7px]
                        text-axio-red
                      ">
                        Passwords do not match
                      </p>
                    )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    w-full
                    py-3
                    rounded-lg
                    bg-axio-red
                    hover:bg-red-600
                    disabled:opacity-60
                    text-white
                    font-bold
                    text-[9px]
                    uppercase
                    tracking-[0.2em]
                    transition-all
                  "
                >
                  {isSubmitting
                    ? 'UPDATING…'
                    : 'UPDATE PASSWORD'}
                </button>
              </form>
            )}

            {/* ======================================================
                GOOGLE
            ====================================================== */}

            {(mode === 'login' ||
              mode === 'register') && (
                <div
                  className={
                    mode === 'register'
                      ? 'mt-4'
                      : 'mt-6'
                  }
                >
                  <div
                    className="
                    flex
                    items-center
                    gap-3
                    mb-3
                  "
                  >
                    <div
                      className="
                      flex-1
                      h-px
                      bg-white/[0.06]
                    "
                    />

                    <span
                      className="
                      text-[7px]
                      uppercase
                      tracking-[0.25em]
                      text-axio-muted/35
                    "
                    >
                      OR
                    </span>

                    <div
                      className="
                      flex-1
                      h-px
                      bg-white/[0.06]
                    "
                    />
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleGoogleLogin
                    }
                    disabled={isSubmitting}
                    className="
                    w-full
                    py-2.5
                    rounded-lg
                    bg-white/[0.02]
                    hover:bg-white/[0.045]
                    border
                    border-white/[0.07]
                    hover:border-white/[0.13]
                    text-white
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    flex
                    items-center
                    justify-center
                    gap-3
                    transition-all
                    duration-300
                    disabled:opacity-50
                  "
                  >
                    <span
                      className="
                      text-sm
                      font-bold
                      normal-case
                    "
                    >
                      G
                    </span>

                    Continue with Google
                  </button>
                </div>
              )}

            {/* ======================================================
                SWITCH LOGIN / REGISTER
            ====================================================== */}

            {(mode === 'login' ||
              mode === 'register') && (
                <div
                  className="
                  mt-5
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-[9px]
                "
                >
                  {mode === 'register' && (
                    <button
                      type="button"
                      onClick={() =>
                        switchMode('login')
                      }
                      disabled={isSubmitting}
                      className="
                      mr-1
                      text-axio-muted
                      hover:text-white
                    "
                    >
                      <ArrowLeft
                        className="
                        w-3
                        h-3
                      "
                      />
                    </button>
                  )}

                  <span className="text-axio-muted">
                    {mode === 'register'
                      ? 'Already have an account?'
                      : "Don't have an account?"}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      switchMode(
                        mode === 'register'
                          ? 'login'
                          : 'register'
                      )
                    }
                    disabled={isSubmitting}
                    className="
                    text-axio-red
                    hover:text-red-400
                    font-semibold
                  "
                  >
                    {mode === 'register'
                      ? 'Sign in'
                      : 'Create account'}
                  </button>
                </div>
              )}

            {/* STATUS */}

            <div
              className="
                mt-5
                flex
                justify-center
                items-center
                gap-2
                text-[7px]
                uppercase
                tracking-[0.2em]
                text-axio-muted/25
              "
            >
              <span
                className="
                  w-1
                  h-1
                  rounded-full
                  bg-axio-red/70
                "
              />

              AXIOGO SYSTEMS OPERATIONAL
            </div>
          </div>
        </section>
      </div>

      {/* ============================================================
          ANIMATIONS + AUTOFILL
      ============================================================ */}

      <style>{`
        @keyframes brandReveal {
          0% {
            opacity: 0;
            transform:
              translateX(-45px)
              scale(0.96);
            filter: blur(10px);
          }

          100% {
            opacity: 1;
            transform:
              translateX(0)
              scale(1);
            filter: blur(0);
          }
        }

        @keyframes loginReveal {
          0% {
            opacity: 0;
            transform:
              translateX(35px)
              scale(0.98);
            filter: blur(8px);
          }

          100% {
            opacity: 1;
            transform:
              translateX(0)
              scale(1);
            filter: blur(0);
          }
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-text-fill-color: #ffffff !important;

          -webkit-box-shadow:
            0 0 0 1000px
            rgba(255,255,255,0.025)
            inset !important;

          box-shadow:
            0 0 0 1000px
            rgba(255,255,255,0.025)
            inset !important;

          caret-color: #ffffff;
        }

        @media (max-width: 1023px) {
          @keyframes brandReveal {
            0% {
              opacity: 0;
              transform:
                translateY(25px);
              filter: blur(8px);
            }

            100% {
              opacity: 1;
              transform:
                translateY(0);
              filter: blur(0);
            }
          }

          @keyframes loginReveal {
            0% {
              opacity: 0;
              transform:
                translateY(25px);
              filter: blur(8px);
            }

            100% {
              opacity: 1;
              transform:
                translateY(0);
              filter: blur(0);
            }
          }
        }

        @media (max-width: 640px) {
          form > div.grid {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration:
              0.01ms !important;

            animation-iteration-count:
              1 !important;

            transition-duration:
              0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};