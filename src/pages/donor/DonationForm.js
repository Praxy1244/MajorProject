import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  Upload, 
  X, 
  Camera,
  MapPin,
  Package,
  Sparkles,
  CheckCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  Info
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { analyzeClothingImage } from '../../mock';

const DonationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    quantity: 1,
    sizes: [],
    colors: [],
    images: [],
    location: user?.location || '',
    pickupAvailable: true,
    deliveryRadius: 10,
    urgentNeeded: false,
    tags: []
  });
  
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);

  const categories = [
    { value: 'outerwear', label: 'Outerwear & Coats' },
    { value: 'formal', label: 'Formal & Business' },
    { value: 'casual', label: 'Casual Wear' },
    { value: 'children', label: 'Children\'s Clothing' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'shoes', label: 'Footwear' },
    { value: 'activewear', label: 'Activewear & Sports' }
  ];

  const conditions = [
    { value: 'excellent', label: 'Excellent - Like new' },
    { value: 'good', label: 'Good - Minor wear' },
    { value: 'fair', label: 'Fair - Some wear but usable' }
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6-7Y', '8-9Y', '10-11Y', '12-13Y', '14-15Y'];
  const colorOptions = ['Black', 'White', 'Gray', 'Navy', 'Brown', 'Red', 'Blue', 'Green', 'Pink', 'Purple', 'Yellow', 'Orange'];

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value) 
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const handleImageUpload = async (files) => {
    const newFiles = Array.from(files).slice(0, 5 - imageFiles.length);
    setImageFiles(prev => [...prev, ...newFiles]);
    
    // Create preview URLs
    const newUrls = newFiles.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newUrls]
    }));

    // Analyze first image if we don't have analysis yet
    if (!aiAnalysis && newFiles.length > 0) {
      setAiAnalyzing(true);
      try {
        const analysis = await analyzeClothingImage(newFiles[0]);
        setAiAnalysis(analysis);
        
        // Auto-fill form based on AI analysis
        setFormData(prev => ({
          ...prev,
          category: prev.category || analysis.category,
          condition: prev.condition || analysis.condition,
          colors: prev.colors.length > 0 ? prev.colors : analysis.colors,
          tags: [...prev.tags, ...analysis.suggestions.slice(0, 3)]
        }));
        
        toast({
          title: "AI Analysis Complete!",
          description: `Detected ${analysis.category} with ${Math.round(analysis.categoryConfidence * 100)}% confidence`,
        });
      } catch (error) {
        toast({
          title: "Analysis Failed",
          description: "Could not analyze image, please fill details manually",
          variant: "destructive"
        });
      } finally {
        setAiAnalyzing(false);
      }
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.title && formData.description && formData.category && formData.condition;
      case 2:
        return formData.images.length > 0 && formData.sizes.length > 0 && formData.colors.length > 0;
      case 3:
        return formData.location;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast({
        title: "Please complete all required fields",
        description: "Fill in the required information to continue",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Simulate donation creation
      const donationData = {
        ...formData,
        id: `don_${Date.now()}`,
        donorId: user.id,
        donorName: user.name,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        aiAnalysis
      };
      
      // Add to localStorage for demo
      const existingDonations = JSON.parse(localStorage.getItem('user_donations') || '[]');
      localStorage.setItem('user_donations', JSON.stringify([...existingDonations, donationData]));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Donation Created Successfully!",
        description: "Your donation is pending admin approval and will be listed soon.",
      });
      
      navigate('/my-donations');
    } catch (error) {
      toast({
        title: "Error Creating Donation",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Step {step} of 4</span>
        <span className="text-sm text-gray-600">{Math.round((step / 4) * 100)}% Complete</span>
      </div>
      <Progress value={(step / 4) * 100} className="h-2" />
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Tell us about the items you're donating</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Donation Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Winter Coats Collection, Business Attire Set"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the items, their condition, and any special notes..."
            rows={4}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="condition">Condition *</Label>
            <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map(cond => (
                  <SelectItem key={cond.value} value={cond.value}>{cond.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="quantity">Number of Items</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
            className="mt-1 max-w-32"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="urgent"
            checked={formData.urgentNeeded}
            onCheckedChange={(checked) => handleInputChange('urgentNeeded', checked)}
          />
          <Label htmlFor="urgent" className="text-sm">
            Mark as urgent need (items will be prioritized)
          </Label>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Photos & Details</h2>
        <p className="text-gray-600">Add photos and specify sizes and colors</p>
      </div>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Upload Photos</span>
            {aiAnalyzing && <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {aiAnalyzing && (
            <Alert className="mb-4">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                AI is analyzing your images to auto-fill details...
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={image} 
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {formData.images.length < 5 && (
              <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition-colors">
                <Upload className="h-6 w-6 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Add Photo</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />
              </label>
            )}
          </div>
          
          <p className="text-sm text-gray-600">
            Upload up to 5 photos. First photo will be analyzed by AI to suggest details.
          </p>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {aiAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <span>AI Analysis Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(aiAnalysis.categoryConfidence * 100)}%
                </div>
                <div className="text-sm text-gray-600">Category Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(aiAnalysis.conditionScore * 100)}%
                </div>
                <div className="text-sm text-gray-600">Condition Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">{aiAnalysis.estimatedSize}</div>
                <div className="text-sm text-gray-600">Estimated Size</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {aiAnalysis.suggestions.map((suggestion, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {suggestion}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sizes */}
      <div>
        <Label className="text-base font-medium">Available Sizes *</Label>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-2">
          {sizeOptions.map(size => (
            <Button
              key={size}
              type="button"
              variant={formData.sizes.includes(size) ? "default" : "outline"}
              size="sm"
              onClick={() => handleMultiSelect('sizes', size)}
              className="h-10"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <Label className="text-base font-medium">Colors *</Label>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
          {colorOptions.map(color => (
            <Button
              key={color}
              type="button"
              variant={formData.colors.includes(color) ? "default" : "outline"}
              size="sm"
              onClick={() => handleMultiSelect('colors', color)}
              className="h-10"
            >
              {color}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pickup & Delivery</h2>
        <p className="text-gray-600">How can recipients get these items?</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="location">Pickup Location *</Label>
          <div className="relative mt-1">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, State/Country"
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="pickup"
            checked={formData.pickupAvailable}
            onCheckedChange={(checked) => handleInputChange('pickupAvailable', checked)}
          />
          <Label htmlFor="pickup">Pickup available at location</Label>
        </div>

        <div>
          <Label htmlFor="delivery">Delivery Radius (km)</Label>
          <Input
            id="delivery"
            type="number"
            min="0"
            max="100"
            value={formData.deliveryRadius}
            onChange={(e) => handleInputChange('deliveryRadius', parseInt(e.target.value))}
            className="mt-1 max-w-32"
          />
          <p className="text-sm text-gray-600 mt-1">
            How far are you willing to deliver? (0 = pickup only)
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Review your donation details before submitting</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{formData.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Category:</strong> {categories.find(c => c.value === formData.category)?.label}
            </div>
            <div>
              <strong>Condition:</strong> {conditions.find(c => c.value === formData.condition)?.label}
            </div>
            <div>
              <strong>Quantity:</strong> {formData.quantity} items
            </div>
            <div>
              <strong>Location:</strong> {formData.location}
            </div>
          </div>
          
          <div>
            <strong>Description:</strong>
            <p className="text-gray-600 mt-1">{formData.description}</p>
          </div>
          
          <div>
            <strong>Sizes:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {formData.sizes.map(size => (
                <Badge key={size} variant="secondary">{size}</Badge>
              ))}
            </div>
          </div>
          
          <div>
            <strong>Colors:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {formData.colors.map(color => (
                <Badge key={color} variant="secondary">{color}</Badge>
              ))}
            </div>
          </div>
          
          {formData.images.length > 0 && (
            <div>
              <strong>Photos:</strong>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {formData.images.slice(0, 4).map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Your donation will be reviewed by our admin team and will be visible to recipients once approved. 
          This usually takes 24-48 hours.
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Donation</h1>
          <p className="text-gray-600 mt-2">Help others by donating clothes you no longer need</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            {renderProgressBar()}
            
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 && (
                <Button 
                  variant="outline" 
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              
              <div className="ml-auto">
                {step < 4 ? (
                  <Button 
                    onClick={handleNext}
                    disabled={!validateStep(step)}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Creating Donation...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Submit Donation
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonationForm;