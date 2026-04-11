import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Package,
  Box,
  Truck,
  Percent,
  AlertCircle,
  Info,
  Trash2,
  Plus,
  Save,
  Pencil,
  Check,
  ExternalLink,
  ChevronDown,
  Search,
  Tag,
  TrendingUp,
  DollarSign,
  LayoutDashboard,
  BarChart3,
  Settings,
  LogOut,
  User,
  Download,
  Filter,
  Calculator,
  Moon,
  Sun,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from './types';
import { calculatePricing, calculateCurrentMargin, ML_THRESHOLD, getEffectiveWeight } from './utils/pricing';
import { getUniqueCategories, getSearchableEntries } from './data/commissions';

type CommentColor = 'green' | 'yellow' | 'red' | '';

function NumberInput({ value, onChange, onBlur, onFocus, className, ...props }: any) {
  const [localValue, setLocalValue] = useState<string | null>(null);

  useEffect(() => {
    if (localValue !== null) {
      const parsed = parseFloat(localValue);
      if (parsed === value || (localValue === '' && value === 0) || (isNaN(parsed) && value === 0)) {
        // It's a match with intermediate typing state
      } else {
        setLocalValue(null); // External value changed, reset local sync
      }
    }
  }, [value, localValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    if (onChange) onChange(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setLocalValue(null);
    if (onBlur) onBlur(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
    if (onFocus) onFocus(e);
  };

  const displayValue = localValue !== null ? localValue : (value === 0 ? '' : value);

  return (
    <input
      type="number"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder="0"
      className={className}
      {...props}
    />
  );
}


interface SavedRecord {
  id: string;
  name: string;
  link: string;
  cost: number;
  packaging: number;
  categoryTax: number;
  taxPercentage: number;
  fixedFee: number;
  shippingFee: number;
  desiredMargin: number;
  weight: number;
  height: number;
  width: number;
  length: number;
  sellingPrice: number;
  mlCommission: number;
  taxes: number;
  profit: number;
  profitMargin: number;
  isFreeShipping: boolean;
  comment: string;
  commentColor: CommentColor;
}

const INITIAL_PRODUCT: Product = {
  id: '1',
  name: 'Meu Produto',
  link: '',
  cost: 150.00,
  categoryTax: 11,
  taxPercentage: 4,
  packaging: 4.50,
  fixedFee: 6.00,
  shippingFee: 18.50,
  desiredMargin: 20,
  weight: 0,
  height: 0,
  width: 0,
  length: 0,
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('meli-products');
      if (saved) {
        return JSON.parse(saved).map((p: any) => ({
          ...p,
          link: p.link || '',
          weight: p.weight || 0,
          height: p.height || 0,
          width: p.width || 0,
          length: p.length || 0,
        }));
      }
      return [INITIAL_PRODUCT];
    } catch {
      return [INITIAL_PRODUCT];
    }
  });

  const [selectedId, setSelectedId] = useState<string>(products[0]?.id || '1');
  const [currentPrice, setCurrentPrice] = useState<number>(289.90);
  const [activeTab, setActiveTab] = useState<'reverse' | 'current'>('reverse');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('meli-theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('meli-theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('meli-theme', 'light');
    }
  }, [isDarkMode]);

  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>(() => {
    try {
      const saved = localStorage.getItem('meli-records');
      if (saved) {
        return JSON.parse(saved).map((r: any) => ({
          ...r,
          link: r.link || '',
          weight: r.weight || 0,
          height: r.height || 0,
          width: r.width || 0,
          length: r.length || 0,
          comment: r.comment || '',
          commentColor: r.commentColor || '',
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const product = useMemo(() =>
    products.find(p => p.id === selectedId) || products[0] || INITIAL_PRODUCT,
  [products, selectedId]);

  useEffect(() => {
    localStorage.setItem('meli-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('meli-records', JSON.stringify(savedRecords));
  }, [savedRecords]);

  const pricingResult = useMemo(() => {
    if (activeTab === 'reverse') {
      return calculatePricing(product);
    } else {
      return calculateCurrentMargin(product, currentPrice);
    }
  }, [product, currentPrice, activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow empty string while typing; convert on blur
    const parsed = value === '' ? 0 : parseFloat(value);
    setProducts(prev => prev.map(p => p.id === selectedId ? {
      ...p,
      [name]: isNaN(parsed) ? 0 : parsed
    } : p));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const lowerVal = val.toLowerCase();
    
    // Auto-detect category based on product title
    const entries = getSearchableEntries();
    // Sort entries by label length descending to match more specific subcategories first
    const sortedEntries = [...entries].sort((a, b) => b.label.length - a.label.length);
    const match = sortedEntries.find(entry => lowerVal.includes(entry.label.toLowerCase()));

    setProducts(prev => prev.map(p => p.id === selectedId ? {
      ...p,
      name: val,
      ...(match ? { categoryTax: match.commission } : {})
    } : p));
  };

  const addNewProduct = () => {
    const newProduct: Product = {
      ...INITIAL_PRODUCT,
      id: Date.now().toString(),
      name: 'Novo Produto',
      link: '',
      weight: 0, height: 0, width: 0, length: 0,
    };
    setProducts(prev => [...prev, newProduct]);
    setSelectedId(newProduct.id);
  };

  const deleteProduct = (id: string) => {
    if (products.length <= 1) return;
    if (selectedId === id) {
      const remaining = products.filter(p => p.id !== id);
      setSelectedId(remaining[0].id);
    }
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const saveRecord = () => {
    const record: SavedRecord = {
      id: Date.now().toString(),
      name: product.name,
      link: product.link,
      cost: product.cost,
      packaging: product.packaging,
      categoryTax: product.categoryTax,
      taxPercentage: product.taxPercentage,
      fixedFee: product.fixedFee,
      shippingFee: product.shippingFee,
      desiredMargin: product.desiredMargin,
      weight: product.weight,
      height: product.height,
      width: product.width,
      length: product.length,
      sellingPrice: pricingResult.sellingPrice,
      mlCommission: pricingResult.mlCommission,
      taxes: pricingResult.taxes,
      profit: pricingResult.profit,
      profitMargin: pricingResult.profitMargin,
      isFreeShipping: pricingResult.isFreeShipping,
      comment: '',
      commentColor: '',
    };
    setSavedRecords(prev => [...prev, record]);
  };

  const deleteRecord = (id: string) => {
    setSavedRecords(prev => prev.filter(r => r.id !== id));
  };

  const recalcRecord = (record: SavedRecord): SavedRecord => {
    const tempProduct: Product = {
      id: record.id,
      name: record.name,
      link: record.link,
      cost: record.cost,
      packaging: record.packaging,
      categoryTax: record.categoryTax,
      taxPercentage: record.taxPercentage,
      fixedFee: record.fixedFee,
      shippingFee: record.shippingFee,
      desiredMargin: record.desiredMargin,
      weight: record.weight,
      height: record.height,
      width: record.width,
      length: record.length,
    };
    const result = calculatePricing(tempProduct);
    return {
      ...record,
      sellingPrice: result.sellingPrice,
      mlCommission: result.mlCommission,
      taxes: result.taxes,
      profit: result.profit,
      profitMargin: result.profitMargin,
      isFreeShipping: result.isFreeShipping,
    };
  };

  const updateRecord = (id: string, field: keyof SavedRecord, value: number | string) => {
    setSavedRecords(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: value };
      if (field === 'comment' || field === 'commentColor' || field === 'link') return updated;
      return recalcRecord(updated);
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top App Bar ── */}
      <header className="fixed top-0 w-full z-50 h-16 flex items-center px-6 bg-surface border-b border-outline-variant/20 transition-colors duration-300">
        <div className="flex-1"></div>
        <h1 className="text-xl font-bold text-primary tracking-wide font-headline text-center flex-none uppercase">MeliCalc</h1>
        <div className="flex-1 flex justify-end gap-3">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant hover:text-on-surface transition-colors"
            title="Alternar Tema"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* ── Side Nav ── */}
      <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-surface border-r border-outline-variant/20 p-4 flex flex-col transition-colors duration-300">
        <button
          onClick={addNewProduct}
          className="mb-6 w-full bg-gradient-to-br from-primary to-primary-container text-white py-3 rounded-xl font-semibold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 text-sm"
        >
          <Plus size={16} />
          Novo Produto
        </button>

        <div className="space-y-1 overflow-y-auto custom-scrollbar">
          <h2 className="text-primary font-headline font-bold text-xs tracking-widest uppercase opacity-60 mb-2">Meus Produtos</h2>
          {products.map(p => (
            <div
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`group w-full flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-150 ${
                selectedId === p.id
                  ? 'bg-white text-primary shadow-sm font-bold dark:bg-surface-container-highest dark:text-on-surface'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <LayoutDashboard size={18} className={selectedId === p.id ? 'text-primary dark:text-on-surface' : 'text-slate-400 dark:text-slate-500'} />
                <span className="text-sm truncate">{p.name || 'Sem título'}</span>
              </div>
              {products.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); deleteProduct(p.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-error transition-all flex-shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main Workspace ── */}
      <main className="ml-64 mt-16 p-8 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Hero title */}
          <div className="flex items-end justify-between">
            <div>
              <span className="text-primary font-bold text-xs tracking-widest uppercase">Análise de Lucratividade</span>
              <h2 className="font-headline text-3xl font-extrabold text-on-surface mt-1">
                {product.name || 'Simulador de Precificação'}
              </h2>
            </div>
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5 text-xs font-medium text-outline border border-outline-variant/30 px-4 py-2 rounded-xl">
                <Info size={13} /> Limiar Frete: <strong className="text-on-surface">{formatCurrency(ML_THRESHOLD)}</strong>
              </span>
              <button
                onClick={saveRecord}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold shadow-xl hover:shadow-primary/40 transition-all flex items-center gap-2 text-sm uppercase tracking-wide border-b-4 border-primary-fixed"
              >
                <Plus size={16} /> ADICIONAR PRODUTO
              </button>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-12 gap-8">

            {/* ── Left: Configuration (7 cols) ── */}
            <section className="col-span-12 lg:col-span-7 space-y-6">
              <div className="bg-surface-container-lowest p-8 rounded-xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Settings size={20} className="text-primary" />
                  </div>
                  <h3 className="font-headline text-xl font-bold">Configuração do Produto</h3>
                </div>

                <div className="space-y-5">
                  {/* Nome */}
                  <div>
                    <label className="label-text">Nome do Produto</label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={handleNameChange}
                      className="input-field"
                      placeholder="Ex: Smartwatch Premium Series 9"
                    />
                  </div>

                  {/* Link */}
                  <div>
                    <label className="label-text">Link Mercado Livre (Opcional)</label>
                    <div className="relative">
                      <ExternalLink size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                      <input
                        type="url"
                        value={product.link}
                        onChange={(e) => setProducts(prev => prev.map(p => p.id === selectedId ? { ...p, link: e.target.value } : p))}
                        className="input-field pl-9"
                        placeholder="https://produto.mercadolivre.com.br/..."
                      />
                    </div>
                  </div>

                  {/* Custo + Embalagem */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="label-text">Custo do Produto (R$)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm font-medium">R$</span>
                        <NumberInput name="cost" value={product.cost} onChange={handleInputChange} className="input-field pl-10" step="0.01" min="0" />
                      </div>
                    </div>
                    <div>
                      <label className="label-text">Embalagem (R$)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm font-medium">R$</span>
                        <NumberInput name="packaging" value={product.packaging} onChange={handleInputChange} className="input-field pl-10" step="0.01" min="0" />
                      </div>
                    </div>
                  </div>

                  {/* Category & Commission */}
                  <div className="pt-4 border-t border-outline-variant/10">
                    <h4 className="text-sm font-bold text-on-surface-variant mb-4">Comissão e Logística</h4>
                    <CategorySelector
                      currentCommission={product.categoryTax}
                      onSelectCategory={(commission) => setProducts(prev => prev.map(p => p.id === selectedId ? { ...p, categoryTax: commission } : p))}
                      onManualChange={(value) => setProducts(prev => prev.map(p => p.id === selectedId ? { ...p, categoryTax: value } : p))}
                    />
                  </div>

                  {/* Imposto */}
                  <div>
                    <label className="label-text">Imposto (%)</label>
                    <div className="relative">
                      <NumberInput name="taxPercentage" value={product.taxPercentage} onChange={handleInputChange} className="input-field pr-8" step="0.1" min="0" max="99" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-outline text-sm">%</span>
                    </div>
                  </div>

                  {/* Margem / preço atual */}
                  <div className="pt-4 border-t border-outline-variant/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-on-surface-variant">LUCRO/MERCADO</h4>
                      <div className="flex bg-surface-container p-1 rounded-lg">
                        <button onClick={() => setActiveTab('reverse')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'reverse' ? 'bg-white text-primary shadow-sm' : 'text-outline'}`}>PREÇO IDEAL</button>
                        <button onClick={() => setActiveTab('current')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'current' ? 'bg-white text-primary shadow-sm' : 'text-outline'}`}>PREÇO DE MERCADO</button>
                      </div>
                    </div>
                    {activeTab === 'reverse' ? (
                      <div>
                        <label className="label-text">Margem Desejada (%)</label>
                        <div className="relative">
                          <NumberInput name="desiredMargin" min="1" max="50" step="0.5" value={product.desiredMargin} onChange={handleInputChange} className="input-field pr-8 text-lg font-bold" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-outline text-sm">%</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="label-text">Preço de Venda Atual (R$)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm font-medium">R$</span>
                          <NumberInput value={currentPrice} onChange={(e: any) => setCurrentPrice(parseFloat(e.target.value) || 0)} className="input-field pl-10 text-lg font-bold" step="0.01" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Frete / Peso */}
                  <div className="pt-4 border-t border-outline-variant/10">
                    <div className="flex items-center gap-2 mb-4">
                      <Truck size={15} className="text-primary" />
                      <h4 className="text-sm font-bold text-on-surface-variant">Frete — Peso e Dimensões</h4>
                    </div>
                    <div className="grid grid-cols-4 gap-3 bg-surface-container-low p-4 rounded-xl">
                      {[
                        { label: 'Peso (kg)', name: 'weight', step: '0.01' },
                        { label: 'Alt (cm)', name: 'height', step: '0.1' },
                        { label: 'Larg (cm)', name: 'width', step: '0.1' },
                        { label: 'Comp (cm)', name: 'length', step: '0.1' },
                      ].map(f => (
                        <div key={f.name}>
                          <label className="block text-[10px] font-bold text-outline mb-1 uppercase">{f.label}</label>
                          <NumberInput name={f.name} value={(product as any)[f.name]} onChange={handleInputChange} step={f.step} min="0" className="w-full bg-transparent border-b border-outline/20 focus:border-primary focus:outline-none py-1 text-sm font-bold" />
                        </div>
                      ))}
                    </div>

                    {(() => {
                      const ew = getEffectiveWeight(product.weight, product.height, product.width, product.length);
                      const volW = (product.height * product.width * product.length) / 6000;
                      if (ew <= 0) return <p className="text-[11px] text-outline mt-2">Preencha peso ou dimensões para calcular o frete automaticamente pela tabela ML.</p>;
                      return (
                        <div className="mt-3 p-3 rounded-lg bg-surface-container-low space-y-1">
                          {volW > 0 && <div className="flex justify-between text-xs"><span className="text-outline">Peso volumétrico</span><span className="font-mono font-semibold">{volW.toFixed(2)} kg</span></div>}
                          <div className="flex justify-between text-xs"><span className="text-outline">Peso efetivo</span><span className="font-mono font-bold text-primary">{ew.toFixed(2)} kg</span></div>
                          <div className="flex justify-between text-xs"><span className="text-outline">Custo frete (auto)</span><span className="font-mono font-bold text-primary">{formatCurrency(pricingResult.fixedFee + pricingResult.shippingFee)}</span></div>
                        </div>
                      );
                    })()}

                    {getEffectiveWeight(product.weight, product.height, product.width, product.length) <= 0 && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="label-text">Taxa Fixa (&lt;79)</label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm font-medium">R$</span>
                            <NumberInput name="fixedFee" value={product.fixedFee} onChange={handleInputChange} className="input-field pl-10" step="0.01" min="0" />
                          </div>
                        </div>
                        <div>
                          <label className="label-text">Frete Grátis (&ge;79)</label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm font-medium">R$</span>
                            <NumberInput name="shippingFee" value={product.shippingFee} onChange={handleInputChange} className="input-field pl-10" step="0.01" min="0" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ── Right: Results (5 cols) ── */}
            <section className="col-span-12 lg:col-span-5 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedId + activeTab + pricingResult.sellingPrice}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="space-y-6"
                >
                  {/* Price card */}
                  <div className="bg-primary text-white p-8 rounded-xl shadow-2xl shadow-primary/20 relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-primary-fixed/70 text-xs font-bold uppercase tracking-widest">
                          {activeTab === 'reverse' ? 'Preço Ideal' : 'Preço de Mercado'}
                        </span>
                        {pricingResult.isFreeShipping ? (
                          <span className="flex items-center gap-1 bg-green-500/25 text-green-300 px-3 py-1 rounded-full text-[10px] font-black border border-green-500/30">
                            <Truck size={10} /> FRETE GRÁTIS
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 bg-secondary-fixed/20 text-secondary-fixed px-3 py-1 rounded-full text-[10px] font-black">
                            <AlertCircle size={10} /> TAXA FIXA
                          </span>
                        )}
                      </div>
                      <div className="text-5xl font-black tracking-tight mt-2">
                        {formatCurrency(pricingResult.sellingPrice)}
                      </div>
                      <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
                          <span className="text-primary-fixed/60 text-[10px] font-bold uppercase block mb-1">Lucro Líquido</span>
                          <span className={`text-2xl font-bold ${pricingResult.profit >= 0 ? 'text-ml-green' : 'text-red-300'}`}>
                            {formatCurrency(pricingResult.profit)}
                          </span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
                          <span className="text-primary-fixed/60 text-[10px] font-bold uppercase block mb-1">Margem Real</span>
                          <span className={`text-2xl font-bold ${pricingResult.profitMargin >= 0 ? 'text-ml-green' : 'text-red-300'}`}>
                            {pricingResult.profitMargin.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary-container rounded-full opacity-20 blur-3xl" />
                  </div>

                  {/* Cost breakdown */}
                  <div className="bg-surface-container-lowest p-8 rounded-xl">
                    <h3 className="font-headline text-lg font-bold mb-6 flex items-center justify-between">
                      Detalhamento de Custos
                      <span className="text-xs font-normal text-outline">
                        Total: {formatCurrency(product.cost + product.packaging + pricingResult.mlCommission + (pricingResult.isFreeShipping ? pricingResult.shippingFee : pricingResult.fixedFee) + pricingResult.taxes)}
                      </span>
                    </h3>
                    <div className="space-y-4">
                      <CostRowNew label="Custo de Aquisição" value={product.cost} color="bg-primary" />
                      <CostRowNew label="Embalagem" value={product.packaging} color="bg-outline" />
                      <CostRowNew label={`Comissão ML (${product.categoryTax}%)`} value={pricingResult.mlCommission} color="bg-tertiary" />
                      <CostRowNew
                        label={pricingResult.isFreeShipping ? 'Frete Grátis (ML)' : 'Taxa Fixa (ML)'}
                        value={pricingResult.isFreeShipping ? pricingResult.shippingFee : pricingResult.fixedFee}
                        color="bg-secondary"
                      />
                      <CostRowNew label={`Imposto (${product.taxPercentage}%)`} value={pricingResult.taxes} color="bg-error" />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </section>

            {/* ── Bottom: Saved Records ── */}
            {savedRecords.length > 0 && (
              <section className="col-span-12">
                <div className="bg-surface-container-low rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
                    <h3 className="font-headline text-lg font-bold">Registros Salvos</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-outline uppercase tracking-widest mr-2">
                        {savedRecords.length} {savedRecords.length === 1 ? 'item' : 'itens'}
                      </span>
                      <button className="p-2 hover:bg-surface-container-high rounded-lg text-outline transition-colors"><Filter size={18} /></button>
                      <button className="p-2 hover:bg-surface-container-high rounded-lg text-outline transition-colors"><Download size={18} /></button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-1 px-4 table-fixed min-w-[1200px]">
                      <thead>
                        <tr className="text-[10px] font-bold text-outline uppercase tracking-widest">
                          <th className="pb-3 pl-4 w-[160px]">Produto</th>
                          <th className="pb-3 w-[100px]">Link</th>
                          <th className="pb-3 text-right">Custo</th>
                          <th className="pb-3 text-right">Embal.</th>
                          <th className="pb-3 text-right">Comissão%</th>
                          <th className="pb-3 text-right">Imposto%</th>
                          <th className="pb-3 text-right">Margem%</th>
                          <th className="pb-3 text-right">Preço Venda</th>
                          <th className="pb-3 text-right">Lucro</th>
                          <th className="pb-3 text-right pr-6">Margem Real</th>
                          <th className="pb-3 pl-6 w-[180px]">Comentário</th>
                          <th className="pb-3 text-right pr-4">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {savedRecords.map(record => {
                          const isEditing = editingId === record.id;
                          const borderColor = record.commentColor === 'green' ? 'border-l-4 border-l-green-500'
                            : record.commentColor === 'yellow' ? 'border-l-4 border-l-amber-400'
                            : record.commentColor === 'red' ? 'border-l-4 border-l-red-500'
                            : 'border-l-4 border-l-transparent';
                          return (
                            <tr key={record.id} className={`bg-surface-container-lowest hover:bg-surface-container-high transition-colors ${borderColor}`}>
                              {isEditing ? (
                                <>
                                  <td className="py-3 pl-4 rounded-l-xl w-[160px]">
                                    <input type="text" value={record.name} onChange={e => updateRecord(record.id, 'name', e.target.value)}
                                      className="w-full text-sm py-1 px-2 rounded-md border border-outline-variant bg-white outline-none focus:ring-2 focus:ring-primary/25" />
                                  </td>
                                  <td className="py-3 px-2">
                                    <input type="url" value={record.link} onChange={e => updateRecord(record.id, 'link', e.target.value)} placeholder="https://..."
                                      className="w-28 text-sm py-1 px-2 rounded-md border border-outline-variant bg-white outline-none focus:ring-2 focus:ring-primary/25" />
                                  </td>
                                  <td className="py-3 px-2">
                                    <NumberInput value={record.cost} onChange={(e: any) => updateRecord(record.id, 'cost', parseFloat(e.target.value) || 0)} step="0.01" min="0"
                                      className="w-20 text-sm text-right py-1 px-2 rounded-md border border-outline-variant bg-white outline-none focus:ring-2 focus:ring-primary/25" />
                                  </td>
                                  <td className="py-3 px-2">
                                    <NumberInput value={record.packaging} onChange={(e: any) => updateRecord(record.id, 'packaging', parseFloat(e.target.value) || 0)} step="0.01" min="0"
                                      className="w-20 text-sm text-right py-1 px-2 rounded-md border border-outline-variant bg-white outline-none focus:ring-2 focus:ring-primary/25" />
                                  </td>
                                  <td className="py-3 px-2">
                                    <NumberInput value={record.categoryTax} onChange={(e: any) => updateRecord(record.id, 'categoryTax', parseFloat(e.target.value) || 0)} step="0.1" min="0" max="99"
                                      className="w-16 text-sm text-right py-1 px-2 rounded-md border border-outline-variant bg-white outline-none focus:ring-2 focus:ring-primary/25" />
                                  </td>
                                  <td className="py-3 px-2">
                                    <NumberInput value={record.taxPercentage} onChange={(e: any) => updateRecord(record.id, 'taxPercentage', parseFloat(e.target.value) || 0)} step="0.1" min="0" max="99"
                                      className="w-16 text-sm text-right py-1 px-2 rounded-md border border-outline-variant bg-white outline-none focus:ring-2 focus:ring-primary/25" />
                                  </td>
                                  <td className="py-3 px-2">
                                    <div className="flex items-center">
                                      <NumberInput value={record.desiredMargin} onChange={(e: any) => updateRecord(record.id, 'desiredMargin', parseFloat(e.target.value) || 0)} step="0.5" min="1" max="50"
                                        className="w-14 text-sm text-right py-1 px-2 rounded-md border border-outline-variant bg-white outline-none focus:ring-2 focus:ring-primary/25" />
                                      <span className="text-xs text-outline ml-0.5">%</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-2 text-right font-mono font-bold text-on-surface text-sm">{formatCurrency(record.sellingPrice)}</td>
                                  <td className={`py-3 px-2 text-right font-mono font-bold text-sm ${record.profit >= 0 ? 'text-ml-green' : 'text-error'}`}>{formatCurrency(record.profit)}</td>
                                  <td className={`py-3 px-2 pr-6 text-right font-mono font-bold text-sm ${record.profitMargin >= 0 ? 'text-ml-green' : 'text-error'}`}>{record.profitMargin.toFixed(2)}%</td>
                                  <td className="py-3 px-2 pl-6">
                                    <div className="flex flex-col gap-1.5">
                                      <input type="text" value={record.comment} onChange={e => updateRecord(record.id, 'comment', e.target.value)} placeholder="Comentário..."
                                        className="w-full min-w-[100px] text-sm py-1 px-2 rounded-md border border-outline-variant bg-white outline-none focus:ring-2 focus:ring-primary/25" />
                                      <div className="flex items-center gap-1.5">
                                        {(['green', 'yellow', 'red'] as CommentColor[]).map(color => (
                                          <button key={color} onClick={() => updateRecord(record.id, 'commentColor', record.commentColor === color ? '' : color)}
                                            className={`w-5 h-5 rounded-full border-2 transition-all ${color === 'green' ? 'bg-green-500' : color === 'yellow' ? 'bg-amber-400' : 'bg-red-500'} ${record.commentColor === color ? 'border-on-surface scale-110' : 'border-white shadow-sm hover:scale-110'}`} />
                                        ))}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-2 rounded-r-xl">
                                    <div className="flex items-center justify-end gap-1">
                                      <button onClick={() => setEditingId(null)} className="p-1.5 text-ml-green hover:bg-ml-green/10 rounded-lg transition-colors" title="Confirmar"><Check size={14} /></button>
                                      <button onClick={() => deleteRecord(record.id)} className="p-1.5 text-outline hover:text-error hover:bg-error-container/20 rounded-lg transition-colors" title="Excluir"><Trash2 size={14} /></button>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="py-4 pl-4 rounded-l-xl w-[160px] max-w-[160px]">
                                    <div className="flex items-center gap-2 w-full overflow-hidden">
                                      <div className="w-6 h-6 rounded bg-surface-container flex items-center justify-center flex-shrink-0">
                                        <Package size={12} className="text-outline" />
                                      </div>
                                      <span className="text-sm font-bold truncate block w-full whitespace-nowrap overflow-hidden text-ellipsis" title={record.name}>{record.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-2">
                                    {record.link ? (
                                      <a href={record.link} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-primary hover:underline max-w-[120px]" title={record.link}>
                                        <ExternalLink size={12} className="flex-shrink-0" />
                                        <span className="truncate text-xs font-medium">
                                          {(() => { try { return new URL(record.link).hostname.replace('www.', ''); } catch { return record.link; } })()}
                                        </span>
                                      </a>
                                    ) : <span className="text-outline/40">—</span>}
                                  </td>
                                  <td className="py-4 px-2 text-right font-mono text-sm text-on-surface-variant">{formatCurrency(record.cost)}</td>
                                  <td className="py-4 px-2 text-right font-mono text-sm text-on-surface-variant">{formatCurrency(record.packaging)}</td>
                                  <td className="py-4 px-2 text-right font-mono text-sm text-on-surface-variant">{record.categoryTax}%</td>
                                  <td className="py-4 px-2 text-right font-mono text-sm text-on-surface-variant">{record.taxPercentage}%</td>
                                  <td className="py-4 px-2">
                                    <div className="flex items-center justify-end">
                                      <NumberInput value={record.desiredMargin} onChange={(e: any) => updateRecord(record.id, 'desiredMargin', parseFloat(e.target.value) || 0)}
                                        step="0.5" min="1" max="50"
                                        className="w-12 text-xs text-right font-mono font-semibold py-0.5 px-1 rounded border border-outline-variant/60 bg-white outline-none focus:ring-1 focus:ring-primary/30" />
                                      <span className="text-xs text-outline ml-0.5">%</span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-2 text-right font-mono font-bold text-sm text-on-surface">{formatCurrency(record.sellingPrice)}</td>
                                  <td className={`py-4 px-2 text-right font-mono font-bold text-sm ${record.profit >= 0 ? 'text-ml-green' : 'text-error'}`}>{formatCurrency(record.profit)}</td>
                                  <td className={`py-4 px-2 pr-6 text-right font-mono font-bold text-sm ${record.profitMargin >= 0 ? 'text-ml-green' : 'text-error'}`}>
                                    {record.profitMargin.toFixed(2)}%
                                  </td>
                                  <td className="py-4 px-2 pl-6">
                                    {record.comment ? (
                                      <div className="flex items-center gap-1.5">
                                        {record.commentColor && (
                                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${record.commentColor === 'green' ? 'bg-green-500' : record.commentColor === 'yellow' ? 'bg-amber-400' : 'bg-red-500'}`} />
                                        )}
                                        <span className="text-xs text-on-surface-variant truncate max-w-[130px]" title={record.comment}>{record.comment}</span>
                                      </div>
                                    ) : <span className="text-outline/40 text-xs">—</span>}
                                  </td>
                                  <td className="py-4 pr-4 rounded-r-xl">
                                    <div className="flex items-center justify-end gap-1">
                                      <button onClick={() => setEditingId(record.id)} className="text-outline hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-container-high" title="Editar"><Pencil size={14} /></button>
                                      <button onClick={() => deleteRecord(record.id)} className="text-outline hover:text-error transition-colors p-1.5 rounded-lg hover:bg-error-container/20 ml-1" title="Excluir"><Trash2 size={14} /></button>
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-6 flex justify-center">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">
                      {savedRecords.length} {savedRecords.length === 1 ? 'registro salvo' : 'registros salvos'} — MeliCalc v1.2
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── CostRow for the new design ── */
function CostRowNew({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className={`w-1.5 h-1.5 rounded-full ${color} flex-shrink-0`} />
        <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors">{label}</span>
      </div>
      <span className="font-mono font-medium text-sm text-on-surface">- {formatCurrency(value)}</span>
    </div>
  );
}

/* ── Category Selector ── */
function CategorySelector({
  currentCommission,
  onSelectCategory,
  onManualChange,
}: {
  currentCommission: number;
  onSelectCategory: (commission: number) => void;
  onManualChange: (value: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => getUniqueCategories(), []);

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(c => c.label.toLowerCase().includes(q));
  }, [categories, search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isOpen]);

  return (
    <div className="space-y-4">
      {/* Category */}
      <div>
        <label className="label-text flex items-center gap-1.5">
          <Tag size={11} className="text-primary" /> Categoria
        </label>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-3 py-3 rounded-lg bg-surface-container-low text-sm font-medium text-on-surface hover:bg-surface-container transition-all focus:outline-none focus:ring-2 focus:ring-surface-tint/30"
          >
            <span className={selectedLabel ? 'text-on-surface' : 'text-outline/60'}>
              {selectedLabel || 'Selecione a categoria...'}
            </span>
            <div className="flex items-center gap-2">
              {selectedLabel && (
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{currentCommission}%</span>
              )}
              <ChevronDown size={16} className={`text-outline transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-outline-variant rounded-xl shadow-xl overflow-hidden">
              <div className="p-2 border-b border-outline-variant/30">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />
                  <input ref={searchInputRef} type="text" value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-outline-variant/40 rounded-lg bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-outline/50"
                    placeholder="Buscar categoria..." />
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto custom-scrollbar">
                {filtered.length === 0 ? (
                  <div className="px-3 py-4 text-center text-sm text-outline">Nenhuma categoria encontrada</div>
                ) : filtered.map(cat => (
                  <button key={cat.label} type="button"
                    onClick={() => { onSelectCategory(cat.commission); setSelectedLabel(cat.label); setIsOpen(false); setSearch(''); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm text-left hover:bg-surface-container-low transition-colors ${selectedLabel === cat.label ? 'bg-primary/5 text-primary font-semibold' : 'text-on-surface'}`}
                  >
                    <span className="truncate">{cat.label}</span>
                    <span className="flex-shrink-0 ml-2 text-xs font-bold text-outline bg-surface-container px-2 py-0.5 rounded-full">{cat.commission}%</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual commission + fixed fee */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-text text-[10px]">Comissão %</label>
          <div className="relative">
            <NumberInput value={currentCommission}
              onChange={(e: any) => { onManualChange(parseFloat(e.target.value) || 0); setSelectedLabel(''); }}
              className="input-field pr-8 font-medium" step="0.1" min="0" max="99" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-outline text-sm">%</span>
          </div>
        </div>
        <div>
          <label className="label-text text-[10px]">Taxa Fixa ML</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm font-medium">R$</span>
            <input readOnly value="Auto (tabela ML)" className="input-field pl-10 text-outline text-xs cursor-not-allowed" />
          </div>
        </div>
      </div>
    </div>
  );
}
