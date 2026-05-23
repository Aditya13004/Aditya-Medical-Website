import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Info, 
  AlertTriangle, 
  Clock, 
  Shield, 
  CheckCircle,
  Star,
  IndianRupee
} from 'lucide-react';
import './MedicineRecommendation.css';

const MedicineRecommendation = ({ medicine, onAddToCart }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = async () => {
    if (isAddingToCart || addedToCart) return;
    
    setIsAddingToCart(true);
    
    try {
      await onAddToCart(medicine);
      setAddedToCart(true);
      
      // Reset the success state after 3 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const getPrescriptionBadge = () => {
    if (medicine.prescriptionRequired || medicine.scheduleType !== 'OTC') {
      return (
        <div className="prescription-badge">
          <Shield size={12} />
          <span>Rx Required</span>
        </div>
      );
    }
    return (
      <div className="otc-badge">
        <CheckCircle size={12} />
        <span>OTC</span>
      </div>
    );
  };

  const getAvailabilityStatus = () => {
    if (!medicine.available) {
      return (
        <div className="availability-status out-of-stock">
          <AlertTriangle size={12} />
          <span>Out of Stock</span>
        </div>
      );
    }
    return (
      <div className="availability-status in-stock">
        <CheckCircle size={12} />
        <span>In Stock</span>
      </div>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className={`medicine-card ${!medicine.available ? 'unavailable' : ''}`}>
      <div className="medicine-header">
        <div className="medicine-title">
          <h5 className="medicine-name">{medicine.name}</h5>
          {medicine.brandName && (
            <p className="brand-name">{medicine.brandName}</p>
          )}
        </div>
        <div className="medicine-badges">
          {getPrescriptionBadge()}
          {getAvailabilityStatus()}
        </div>
      </div>

      <div className="medicine-info">
        <div className="dosage-info">
          <div className="dosage-item">
            <strong>Dosage:</strong>
            <span>{medicine.dosage}</span>
          </div>
          <div className="dosage-item">
            <strong>Duration:</strong>
            <span>{medicine.duration}</span>
          </div>
        </div>

        <div className="price-section">
          <div className="price">
            <IndianRupee size={16} />
            <span className="current-price">{formatPrice(medicine.price)}</span>
            {medicine.originalPrice && medicine.originalPrice > medicine.price && (
              <span className="original-price">{formatPrice(medicine.originalPrice)}</span>
            )}
          </div>
          {medicine.savings && (
            <div className="savings">
              Save {formatPrice(medicine.savings)}
            </div>
          )}
        </div>
      </div>

      {medicine.precautions && medicine.precautions.length > 0 && (
        <div className="precautions-section">
          <div className="precautions-header">
            <AlertTriangle size={14} />
            <span>Precautions</span>
          </div>
          <ul className="precautions-list">
            {medicine.precautions.slice(0, 2).map((precaution, index) => (
              <li key={index}>{precaution}</li>
            ))}
            {medicine.precautions.length > 2 && (
              <li className="more-precautions">
                +{medicine.precautions.length - 2} more
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="medicine-actions">
        <button
          className="details-button"
          onClick={() => setShowDetails(!showDetails)}
        >
          <Info size={16} />
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>
        
        <button
          className={`add-to-cart-button ${addedToCart ? 'added' : ''} ${isAddingToCart ? 'adding' : ''}`}
          onClick={handleAddToCart}
          disabled={!medicine.available || isAddingToCart || addedToCart}
        >
          {addedToCart ? (
            <>
              <CheckCircle size={16} />
              Added!
            </>
          ) : isAddingToCart ? (
            <>
              <div className="spinner"></div>
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Add to Cart
            </>
          )}
        </button>
      </div>

      {showDetails && (
        <div className="medicine-details">
          <div className="details-grid">
            {medicine.genericName && (
              <div className="detail-item">
                <strong>Generic Name:</strong>
                <span>{medicine.genericName}</span>
              </div>
            )}
            
            {medicine.manufacturer && (
              <div className="detail-item">
                <strong>Manufacturer:</strong>
                <span>{medicine.manufacturer}</span>
              </div>
            )}
            
            {medicine.strength && (
              <div className="detail-item">
                <strong>Strength:</strong>
                <span>{medicine.strength}</span>
              </div>
            )}
            
            {medicine.dosageForm && (
              <div className="detail-item">
                <strong>Form:</strong>
                <span>{medicine.dosageForm}</span>
              </div>
            )}
          </div>

          {medicine.indications && medicine.indications.length > 0 && (
            <div className="indications-section">
              <h6>Indications:</h6>
              <ul>
                {medicine.indications.map((indication, index) => (
                  <li key={index}>{indication}</li>
                ))}
              </ul>
            </div>
          )}

          {medicine.sideEffects && medicine.sideEffects.length > 0 && (
            <div className="side-effects-section">
              <h6>Common Side Effects:</h6>
              <ul>
                {medicine.sideEffects.map((effect, index) => (
                  <li key={index}>{effect}</li>
                ))}
              </ul>
            </div>
          )}

          {medicine.foodInstructions && (
            <div className="food-instructions">
              <strong>Food Instructions:</strong>
              <span>{medicine.foodInstructions}</span>
            </div>
          )}

          {medicine.contraindications && medicine.contraindications.length > 0 && (
            <div className="contraindications-section">
              <h6 className="warning">Contraindications:</h6>
              <ul>
                {medicine.contraindications.map((contraindication, index) => (
                  <li key={index}>{contraindication}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="medicine-disclaimer">
            <AlertTriangle size={12} />
            <span>
              This medicine information is for reference only. Please consult a healthcare professional before use.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineRecommendation;