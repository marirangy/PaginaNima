import express from 'express';
import FAQ from '../models/faq.js'; 

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1 });
    res.json(faqs);
  } catch (err) {
    console.error('❌ Error al obtener FAQs:', err);
    res.status(500).json({ error: 'Error al obtener FAQs' });
  }
});


router.get('/:slug', async (req, res) => {
  try {
    const faq = await FAQ.findOne({ slug: req.params.slug, isActive: true });
    if (!faq) {
      return res.status(404).json({ error: 'FAQ no encontrada' });
    }
    res.json(faq);
  } catch (err) {
    console.error('❌ Error al obtener FAQ por slug:', err);
    res.status(500).json({ error: 'Error al obtener FAQ' });
  }
});

export default router;
