import { FiEdit, FiTrash2, FiChevronLeft, FiChevronRight, FiX, FiPlus, FiEye , FiBell} from "react-icons/fi";
import { Link } from "react-router-dom";
export const EmptyState: React.FC<{ onCreateListing: () => void }> = ({ onCreateListing }) => (
    
  <div className="empty-state">
    <span><FiEye size={40} /></span>
    <h3>No listings yet</h3>
    <p>You haven't posted any items for sale. Create your first listing to start selling.</p>
    <button onClick={onCreateListing}>
         <Link to="/postitem" className="primary-btn tech-btn">
          <FiPlus size={18} /> Create Listing
         </Link>
     
    </button>
  </div>
);