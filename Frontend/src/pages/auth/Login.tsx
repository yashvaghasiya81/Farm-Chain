
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from the location state, or default to dashboard
  const from = location.state?.from?.pathname || "/";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      
      // Navigate to the from location or appropriate dashboard
      navigate(from);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Quick login buttons for demo purposes
  const loginAsFarmer = async () => {
    setEmail("mary@example.com");
    setPassword("password");
    
    try {
      setIsSubmitting(true);
      await login("mary@example.com", "password");
      navigate("/farmer/dashboard");
    } catch (err) {
      setError("Demo login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const loginAsConsumer = async () => {
    setEmail("john@example.com");
    setPassword("password");
    
    try {
      setIsSubmitting(true);
      await login("john@example.com", "password");
      navigate("/consumer/dashboard");
    } catch (err) {
      setError("Demo login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Login to FarmChain</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-farm-green-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-farm-green-600 hover:bg-farm-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
        
        <div className="mt-6">
          <p className="text-center text-sm mb-4">Demo Login Options</p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={loginAsConsumer}
              disabled={isSubmitting}
            >
              Consumer Demo
            </Button>
            <Button
              variant="outline"
              onClick={loginAsFarmer}
              disabled={isSubmitting}
            >
              Farmer Demo
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-farm-green-600 hover:underline">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default Login;
