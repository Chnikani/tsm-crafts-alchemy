import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const OrderProcess = () => {
  // Order process steps based on the image
  const orderSteps = [
    {
      id: 1,
      title: "Explore & Click",
      description: "Browse our collection and click on the 'Inquire' button on any item you love.",
      icon: "🔍"
    },
    {
      id: 2,
      title: "Fill & Send",
      description: "Complete a simple form with your details and specific requirements through our secure system.",
      icon: "📝"
    },
    {
      id: 3,
      title: "Pay & Wait",
      description: "Make a secure payment through our verified payment methods, then wait for your handcrafted items to arrive.",
      icon: "💳"
    }
  ];

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <main className="container px-4 py-8">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            How to Place Your Order
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've made ordering from TSM Crafts simple and straightforward. 
            Follow these easy steps to get your hands on our beautiful handcrafted items.
          </p>
        </div>

        {/* Order Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {orderSteps.map((step) => (
            <Card key={step.id} className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold mx-auto mb-4">
                  {step.id}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Our Story Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Our Story</h2>
          <div className="bg-card rounded-lg p-6 shadow-md">
            <p className="text-muted-foreground mb-4">
              In 2020, we set out on a mission to bring the magic of traditional Sri Lankan craftsmanship to the modern world. 
              What started as a small family business has grown into a beloved brand with a dedicated following.
            </p>
            <p className="text-muted-foreground mb-4">
              Our team of skilled artisans combines time-honored techniques with contemporary designs to create pieces that are both beautiful and functional. 
              Each item is made with love and attention to detail, ensuring that you receive only the highest quality products.
            </p>
            <p className="text-muted-foreground">
              We're committed to supporting local communities and preserving traditional crafts. By choosing TSM Crafts, you're not just getting a beautiful handmade item – you're helping to keep these precious skills alive for generations to come.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Contact Us</h2>
          <div className="bg-card rounded-lg p-6 shadow-md">
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="font-semibold mr-2">Email:</span>
                <a href="mailto:hello@tsmcrafts.com" className="text-primary hover:underline">hello@tsmcrafts.com</a>
              </li>
              <li className="flex items-center">
                <span className="font-semibold mr-2">Phone:</span>
                <a href="tel:+94112345678" className="text-primary hover:underline">+94 11 234 5678</a>
              </li>
              <li className="flex items-center">
                <span className="font-semibold mr-2">Address:</span>
                <span>123 Craft Street, Colombo 07, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Creative Vision Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Our Creative Vision</h2>
          <div className="bg-card rounded-lg p-6 shadow-md">
            <p className="text-muted-foreground mb-4">
              Our design philosophy at TSM Crafts is a blend of vibrant creativity and meticulous craftsmanship. We draw inspiration from Sri Lanka's rich cultural heritage while embracing modern aesthetic sensibilities.
            </p>
            <p className="text-muted-foreground mb-4">
              We believe in creating pieces that tell a story – each product carries with it the legacy of traditional techniques passed down through generations, combined with innovative approaches that keep our designs fresh and relevant.
            </p>
            <p className="text-muted-foreground">
              Our signature style is defined by bold colors, intricate patterns, and exceptional attention to detail. We're constantly exploring new materials and techniques to push the boundaries of what's possible in handcrafted art.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderProcess;