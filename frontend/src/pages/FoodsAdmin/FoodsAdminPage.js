import { useEffect, useState } from 'react';
import classes from './foodsAdminPage.module.css';
import { Link, useParams } from 'react-router-dom';
import { deleteById, getAll, search } from '../../services/foodService';
import NotFound from '../../components/NotFound/NotFound';
import Title from '../../components/Title/Title';
import Search from '../../components/Search/Search';
import Price from '../../components/Price/Price';
import { toast } from 'react-toastify';

export default function FoodsAdminPage() {
  const [foods, setFoods] = useState([]);
  const { searchTerm } = useParams();

  useEffect(() => {
    loadFoods();
  }, [searchTerm]);

  const loadFoods = async () => {
    try {
      const foods = searchTerm ? await search(searchTerm) : await getAll();
      console.log('Fetched Foods:', foods); // Debugging line
      setFoods(foods || []);
    } catch (error) {
      console.error('Error loading foods:', error);
      toast.error('Failed to load foods');
    }
  };

  const FoodsNotFound = () => {
    if (foods && foods.length > 0) return null;

    return searchTerm ? (
      <NotFound linkRoute="/admin/foods" linkText="Show All" />
    ) : (
      <NotFound linkRoute="/dashboard" linkText="Back to dashboard!" />
    );
  };

  const deleteFood = async food => {
    const confirmed = window.confirm(`Delete Food ${food.name}?`);
    if (!confirmed) return;

    try {
      await deleteById(food.id);
      toast.success(`"${food.name}" Has Been Removed!`);
      setFoods(foods.filter(f => f.id !== food.id));
    } catch (error) {
      console.error('Error deleting food:', error);
      toast.error('Failed to delete food');
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.list}>
        <Title title="Manage Foods" margin="1rem auto" />
        <Search
          searchRoute="/admin/foods/"
          defaultRoute="/admin/foods"
          margin="1rem 0"
          placeholder="Search Foods"
        />
        <Link to="/admin/addFood" className={classes.add_food}>
          Add Food +
        </Link>
        <FoodsNotFound />
        {foods.map(food => (
          <div key={food.id} className={classes.list_item}>
            <img src={food.imageUrl} alt={food.name} />
            <Link to={'/food/' + food.id}>{food.name}</Link>
            <Price price={food.price} />
            <div className={classes.actions}>
              <Link to={'/admin/editFood/' + food.id}>Edit</Link>
              <button onClick={() => deleteFood(food)}>Delete</button> {/* Changed from <Link> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
