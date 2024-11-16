import { useParams } from 'react-router-dom'
import EditStockItemForm from '@/components/pages/Stock/UpdateStockItemForm'

const EditStockItemFormWrapper = () => {
    const { itemId } = useParams<{ itemId: string }>()
    return <EditStockItemForm itemId={parseInt(itemId!, 10)} />
}

export default EditStockItemFormWrapper
